import { FirestoreModel } from '../utils/firebaseModel.js';

const Order = new FirestoreModel({
  collectionName: 'orders',
  fields: [
    { name: 'user' },
    { name: 'orderNumber' },
    { name: 'items' },
    { name: 'giftBox' },
    { name: 'personalizedMessage' },
    { name: 'deliveryDate' },
    { name: 'shippingAddress' },
    { name: 'subtotal' },
    { name: 'packagingFee' },
    { name: 'deliveryFee' },
    { name: 'tax' },
    { name: 'total' },
    { name: 'status' },
    { name: 'payment' },
    { name: 'createdAt' },
    { name: 'updatedAt' }
  ],
  timestamps: true
});

Order.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = `SV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  if (this.personalizedMessage === undefined) {
    this.personalizedMessage = '';
  }
  if (this.packagingFee === undefined) {
    this.packagingFee = 99;
  }
  if (this.deliveryFee === undefined) {
    this.deliveryFee = 49;
  }
  if (this.tax === undefined) {
    this.tax = 0;
  }
  if (this.subtotal === undefined) {
    this.subtotal = 0;
  }
  if (this.total === undefined) {
    this.total = 0;
  }
  if (this.status === undefined) {
    this.status = 'pending';
  }
  if (!this.payment) {
    this.payment = {};
  }
});

export default Order;
