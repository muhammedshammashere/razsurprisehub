import { FirestoreModel } from '../utils/firebaseModel.js';

const GiftBox = new FirestoreModel({
  collectionName: 'giftboxes',
  fields: [
    { name: 'user' },
    { name: 'items' },
    { name: 'personalizedMessage' },
    { name: 'deliveryDate' },
    { name: 'packagingFee' },
    { name: 'subtotal' },
    { name: 'total' },
    { name: 'status' },
    { name: 'createdAt' },
    { name: 'updatedAt' }
  ],
  timestamps: true
});

GiftBox.methods.recalculate = function () {
  const items = this.items || [];
  this.subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0), 0);
  this.total = this.subtotal + (Number(this.packagingFee) || 99);
};

GiftBox.pre('save', function () {
  if (this.personalizedMessage === undefined) {
    this.personalizedMessage = '';
  }
  if (this.packagingFee === undefined) {
    this.packagingFee = 99;
  }
  if (this.subtotal === undefined) {
    this.subtotal = 0;
  }
  if (this.total === undefined) {
    this.total = 0;
  }
  if (this.status === undefined) {
    this.status = 'draft';
  }
  if (!this.items) {
    this.items = [];
  }

  this.recalculate();
});

export default GiftBox;
