import mongoose from 'mongoose';

export const CATEGORIES = [
  'Chocolates',
  'Flowers',
  'Greeting Cards',
  'Teddy Bears',
  'Perfumes',
  'Custom Gifts',
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ url: String }],
    isActive: { type: Boolean, default: true },
    tags: [String],
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Product', productSchema);
