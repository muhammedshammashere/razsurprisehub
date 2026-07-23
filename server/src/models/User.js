import { FirestoreModel } from '../utils/firebaseModel.js';
import bcrypt from 'bcryptjs';

const User = new FirestoreModel({
  collectionName: 'users',
  fields: [
    { name: 'name' },
    { name: 'email' },
    { name: 'password', select: false },
    { name: 'phone' },
    { name: 'role', default: 'user' },
    { name: 'address' },
    { name: 'createdAt' },
    { name: 'updatedAt' }
  ],
  timestamps: true
});

User.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

User.methods.comparePassword = function (candidate) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidate, this.password);
};

export default User;
