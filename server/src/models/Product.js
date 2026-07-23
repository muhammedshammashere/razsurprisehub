import { FirestoreModel } from '../utils/firebaseModel.js';

export const CATEGORIES = [
  'Chocolates',
  'Flowers',
  'Greeting Cards',
  'Teddy Bears',
  'Perfumes',
  'Custom Gifts',
];

const Product = new FirestoreModel({
  collectionName: 'products',
  fields: [
    { name: 'name' },
    { name: 'slug' },
    { name: 'description' },
    { name: 'category' },
    { name: 'price' },
    { name: 'stock', default: 0 },
    { name: 'images' },
    { name: 'isActive', default: true },
    { name: 'tags' },
    { name: 'createdAt' },
    { name: 'updatedAt' }
  ],
  timestamps: true
});

Product.pre('save', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export default Product;
