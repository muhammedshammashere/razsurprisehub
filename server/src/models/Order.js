import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    giftBox: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftBox' },
    personalizedMessage: { type: String, default: '' },
    deliveryDate: { type: Date, required: true },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    subtotal: { type: Number, default: 0 },
    packagingFee: { type: Number, default: 99 },
    deliveryFee: { type: Number, default: 49 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      method: String,
      paidAt: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `SV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
