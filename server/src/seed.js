import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product, { CATEGORIES } from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Belgian Truffle Box',
    description: 'Premium assorted Belgian chocolates in a luxury box.',
    category: 'Chocolates',
    price: 899,
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1481391319762-47dff72954a0?w=400' }],
  },
  {
    name: 'Red Rose Bouquet',
    description: '12 fresh red roses wrapped with satin ribbon.',
    category: 'Flowers',
    price: 1299,
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1518895949257-7621f3c786d7?w=400' }],
  },
  {
    name: 'Birthday Wishes Card',
    description: 'Handcrafted greeting card with gold foil accents.',
    category: 'Greeting Cards',
    price: 199,
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1513885535751-8b923fbd345a?w=400' }],
  },
  {
    name: 'Cuddly Teddy Bear',
    description: 'Soft 12-inch teddy bear — perfect for any occasion.',
    category: 'Teddy Bears',
    price: 799,
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1559454407-e7efff7d86d9?w=400' }],
  },
  {
    name: 'Floral Essence Perfume',
    description: 'Elegant 50ml floral fragrance gift set.',
    category: 'Perfumes',
    price: 2499,
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400' }],
  },
  {
    name: 'Custom Photo Frame',
    description: 'Personalized wooden frame with your special photo.',
    category: 'Custom Gifts',
    price: 599,
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400' }],
  },
];

const seed = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@razsurprisehub.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminraz@2026';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('Admin already exists');
  }

  let customer = await User.findOne({ email: 'customer@surpriseventure.com' });
  if (!customer) {
    await User.create({
      name: 'Customer',
      email: 'customer@surpriseventure.com',
      password: 'customer123456',
      role: 'user',
    });
    console.log('Customer created: customer@surpriseventure.com / customer123456');
  } else {
    console.log('Customer already exists');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products`);
  } else {
    console.log('Products already seeded');
  }

  console.log('Categories:', CATEGORIES.join(', '));
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
