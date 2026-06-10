import mongoose from 'mongoose';

const boxItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true },
});

const giftBoxSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [boxItemSchema],
    personalizedMessage: { type: String, maxlength: 500, default: '' },
    deliveryDate: { type: Date },
    packagingFee: { type: Number, default: 99 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'converted'], default: 'draft' },
  },
  { timestamps: true }
);

giftBoxSchema.methods.recalculate = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  this.total = this.subtotal + (this.packagingFee || 0);
};

giftBoxSchema.pre('save', function (next) {
  this.recalculate();
  next();
});

export default mongoose.model('GiftBox', giftBoxSchema);
