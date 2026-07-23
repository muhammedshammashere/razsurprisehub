import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';

let db;
export const setMockDB = (mock) => {
  db = mock;
};
export const getDB = () => {
  if (!db) {
    db = getFirestore();
  }
  return db;
};

// Helper for exact and complex query matching in JS
export function matchesFilter(docData, filter) {
  if (!filter) return true;
  for (const key in filter) {
    if (key === '$or') {
      const subFilters = filter[key];
      if (!Array.isArray(subFilters)) return false;
      const matchAny = subFilters.some(sub => matchesFilter(docData, sub));
      if (!matchAny) return false;
      continue;
    }

    const filterVal = filter[key];
    const docVal = docData[key];

    if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal)) {
      const operators = Object.keys(filterVal);
      for (const op of operators) {
        const val = filterVal[op];
        if (op === '$regex') {
          const options = filterVal['$options'] || '';
          const regex = new RegExp(val, options);
          if (!regex.test(docVal || '')) return false;
        } else if (op === '$options') {
          // Handled together with $regex
        } else if (op === '$ne') {
          const docStr = docVal?.toString();
          const valStr = val?.toString();
          if (docStr === valStr) return false;
        } else if (op === '$in') {
          if (!Array.isArray(val)) return false;
          const docStr = docVal?.toString();
          const match = val.some(v => v?.toString() === docStr);
          if (!match) return false;
        }
      }
    } else {
      // Exact match
      const filterStr = filterVal?.toString();
      const docStr = docVal?.toString();
      if (filterStr !== docStr) return false;
    }
  }
  return true;
}

// In-memory populator
export async function populateDocs(docs, path, selectFields) {
  if (!docs || docs.length === 0) return;
  const db = getDB();

  if (path === 'items.product') {
    for (const doc of docs) {
      if (Array.isArray(doc.items)) {
        for (const item of doc.items) {
          if (item.product && typeof item.product === 'string') {
            const productDoc = await db.collection('products').doc(item.product).get();
            if (productDoc.exists) {
              item.product = { _id: productDoc.id, id: productDoc.id, ...productDoc.data() };
            }
          }
        }
      }
    }
  } else if (path === 'user') {
    for (const doc of docs) {
      if (doc.user && typeof doc.user === 'string') {
        const userDoc = await db.collection('users').doc(doc.user).get();
        if (userDoc.exists) {
          const userData = { _id: userDoc.id, id: userDoc.id, ...userDoc.data() };
          delete userData.password;
          doc.user = userData;
        }
      }
    }
  } else if (path === 'giftBox') {
    for (const doc of docs) {
      if (doc.giftBox && typeof doc.giftBox === 'string') {
        const giftBoxDoc = await db.collection('giftboxes').doc(doc.giftBox).get();
        if (giftBoxDoc.exists) {
          doc.giftBox = { _id: giftBoxDoc.id, id: giftBoxDoc.id, ...giftBoxDoc.data() };
        }
      }
    }
  }
}

// Document wrapper representing a Mongoose Document instance
export class FirestoreDocument {
  constructor(model, data) {
    this.model = model;
    Object.assign(this, data);

    // Bind custom methods
    if (model.methods) {
      for (const name in model.methods) {
        this[name] = model.methods[name].bind(this);
      }
    }
  }

  async populate(path, select) {
    await populateDocs([this], path, select);
    return this;
  }

  isModified(field) {
    if (field === 'password') {
      return this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$');
    }
    return true;
  }

  async save() {
    // Run pre-save hooks
    if (this.model.preHooks['save']) {
      for (const hook of this.model.preHooks['save']) {
        await hook.call(this);
      }
    }

    const dataToSave = {};
    this.model.fields.forEach(field => {
      let val = this[field.name];
      if (val === undefined && field.default !== undefined) {
        val = typeof field.default === 'function' ? field.default() : field.default;
        this[field.name] = val;
      }
      if (val !== undefined) {
        dataToSave[field.name] = val;
      }
    });

    if (this.model.timestamps) {
      const now = new Date();
      if (!this.createdAt) {
        this.createdAt = now;
        this.createdAt.setMilliseconds(0);
      }
      this.updatedAt = now;
      this.updatedAt.setMilliseconds(0);
      dataToSave.createdAt = this.createdAt;
      dataToSave.updatedAt = this.updatedAt;
    }

    const db = getDB();
    if (this._id) {
      await db.collection(this.model.collectionName).doc(this._id).set(dataToSave, { merge: true });
    } else {
      const docRef = await db.collection(this.model.collectionName).add(dataToSave);
      this._id = docRef.id;
      this.id = docRef.id;
    }
    return this;
  }

  toString() {
    return this._id;
  }
}

// Query builder wrapper to support chained Mongoose queries
export class FirestoreQuery {
  constructor(model, filter = {}) {
    this.model = model;
    this.filter = filter;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._populates = [];
    this._selects = [];
    this._isFindOne = false;
    this._update = null;
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  skip(val) {
    this._skip = Number(val) || 0;
    return this;
  }

  limit(val) {
    this._limit = Number(val) || null;
    return this;
  }

  populate(path, select) {
    this._populates.push({ path, select });
    return this;
  }

  select(fields) {
    if (typeof fields === 'string') {
      this._selects = fields.split(' ');
    }
    return this;
  }

  async exec() {
    const db = getDB();
    let results = [];

    if (this._update) {
      const docId = (this.filter._id || this.filter.id || '').toString();
      if (docId) {
        const updatedDoc = await this.model._performUpdate(docId, this._update);
        if (updatedDoc) {
          results.push(updatedDoc);
        }
      }
      this._isFindOne = true;
    } else {
      const docId = (this.filter._id || this.filter.id || '').toString();
      if (docId) {
        const doc = await db.collection(this.model.collectionName).doc(docId).get();
        if (doc.exists) {
          const data = { _id: doc.id, id: doc.id, ...doc.data() };
          for (const key in data) {
            if (data[key] && typeof data[key].toDate === 'function') {
              data[key] = data[key].toDate();
            }
          }
          results.push(new FirestoreDocument(this.model, data));
        }
      } else {
        const snapshot = await db.collection(this.model.collectionName).get();
        snapshot.forEach(doc => {
          const data = { _id: doc.id, id: doc.id, ...doc.data() };
          for (const key in data) {
            if (data[key] && typeof data[key].toDate === 'function') {
              data[key] = data[key].toDate();
            }
          }
          results.push(new FirestoreDocument(this.model, data));
        });
      }
    }

    // 1. Filtering
    results = results.filter(doc => matchesFilter(doc, this.filter));

    // 2. Sorting
    if (this._sort) {
      const keys = Object.keys(this._sort);
      results.sort((a, b) => {
        for (const key of keys) {
          const dir = this._sort[key];
          let valA = a[key];
          let valB = b[key];

          if (valA instanceof Date) valA = valA.getTime();
          if (valB instanceof Date) valB = valB.getTime();

          if (valA < valB) return dir === -1 || dir === 'desc' ? 1 : -1;
          if (valA > valB) return dir === -1 || dir === 'desc' ? -1 : 1;
        }
        return 0;
      });
    }

    // 3. Skip & Limit
    if (this._skip > 0) {
      results = results.slice(this._skip);
    }
    if (this._limit !== null) {
      results = results.slice(0, this._limit);
    }

    // 4. Populates
    for (const pop of this._populates) {
      await populateDocs(results, pop.path, pop.select);
    }

    // 5. Select
    results.forEach(doc => {
      this.model.fields.forEach(field => {
        const isExclude = field.select === false;
        const explicitlySelected = this._selects.includes(`+${field.name}`) || this._selects.includes(field.name);
        const explicitlyExcluded = this._selects.includes(`-${field.name}`);
        
        if ((isExclude && !explicitlySelected) || explicitlyExcluded) {
          delete doc[field.name];
        }
      });
    });

    if (this._isFindOne) {
      return results[0] || null;
    }
    return results;
  }

  then(onfulfilled, onrejected) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

// Main Model configuration class that replaces Mongoose Model
export class FirestoreModel {
  constructor({ collectionName, fields, timestamps = true }) {
    this.collectionName = collectionName;
    this.fields = fields;
    this.timestamps = timestamps;
    this.preHooks = {};
    this.methods = {};
  }

  pre(event, fn) {
    if (!this.preHooks[event]) {
      this.preHooks[event] = [];
    }
    this.preHooks[event].push(fn);
  }

  // Internal update method
  async _performUpdate(id, update) {
    const db = getDB();
    const docRef = db.collection(this.collectionName).doc(id.toString());
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;

    const data = { _id: docSnap.id, id: docSnap.id, ...docSnap.data() };
    for (const key in data) {
      if (data[key] && typeof data[key].toDate === 'function') {
        data[key] = data[key].toDate();
      }
    }
    const doc = new FirestoreDocument(this, data);

    for (const key in update) {
      if (key === '$inc') {
        for (const incField in update[key]) {
          doc[incField] = (Number(doc[incField]) || 0) + Number(update[key][incField]);
        }
      } else if (key === '$push') {
        for (const pushField in update[key]) {
          if (!Array.isArray(doc[pushField])) {
            doc[pushField] = [];
          }
          doc[pushField].push(update[key][pushField]);
        }
      } else {
        doc[key] = update[key];
      }
    }

    await doc.save();
    return doc;
  }

  findOne(query) {
    const q = new FirestoreQuery(this, query).limit(1);
    q._isFindOne = true;
    return q;
  }

  findById(id) {
    const q = new FirestoreQuery(this, { _id: id }).limit(1);
    q._isFindOne = true;
    return q;
  }

  find(query) {
    return new FirestoreQuery(this, query);
  }

  async countDocuments(query = {}) {
    const results = await new FirestoreQuery(this, query).exec();
    return results.length;
  }

  async create(data) {
    const doc = new FirestoreDocument(this, data);
    await doc.save();
    return doc;
  }

  async insertMany(arr) {
    const docs = [];
    for (const item of arr) {
      const doc = await this.create(item);
      docs.push(doc);
    }
    return docs;
  }

  findByIdAndUpdate(id, update, options = {}) {
    const q = new FirestoreQuery(this, { _id: id });
    q._update = update;
    return q;
  }

  async deleteMany(query = {}) {
    const docs = await new FirestoreQuery(this, query).exec();
    const db = getDB();
    for (const doc of docs) {
      await db.collection(this.collectionName).doc(doc._id).delete();
    }
    return { deletedCount: docs.length };
  }

  async aggregate(pipeline) {
    let docs = await new FirestoreQuery(this).exec();

    for (const stage of pipeline) {
      if (stage.$match) {
        docs = docs.filter(doc => matchesFilter(doc, stage.$match));
      }
      if (stage.$group) {
        const groupSpec = stage.$group;
        const { _id, total } = groupSpec;

        if (_id === null) {
          if (total && total.$sum) {
            const sumField = total.$sum.startsWith('$') ? total.$sum.slice(1) : total.$sum;
            const sum = docs.reduce((acc, d) => acc + (Number(d[sumField]) || 0), 0);
            return [{ _id: null, total: sum }];
          }
          return [{ _id: null }];
        } else if (typeof _id === 'string' && _id.startsWith('$')) {
          const groupField = _id.slice(1);
          const groups = {};

          docs.forEach(doc => {
            const groupVal = doc[groupField];
            if (!groups[groupVal]) {
              groups[groupVal] = { _id: groupVal, count: 0, total: 0 };
            }
            groups[groupVal].count += 1;
            if (total && total.$sum && total.$sum !== 1) {
              const sumField = total.$sum.startsWith('$') ? total.$sum.slice(1) : total.$sum;
              groups[groupVal].total += Number(doc[sumField]) || 0;
            }
          });

          return Object.values(groups);
        }
      }
    }
    return [];
  }
}
