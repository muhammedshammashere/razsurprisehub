import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Order from './models/Order.js';
import GiftBox from './models/GiftBox.js';

dotenv.config();

const resetDemoData = async () => {
  await connectDB();

  const deletedUsers = await User.deleteMany({ role: { $ne: 'admin' } });
  const deletedOrders = await Order.deleteMany({});
  const deletedGiftBoxes = await GiftBox.deleteMany({});

  const admins = await User.find({ role: 'admin' }).select('name email role');

  console.log(`Removed ${deletedUsers.deletedCount} non-admin users`);
  console.log(`Removed ${deletedOrders.deletedCount} orders`);
  console.log(`Removed ${deletedGiftBoxes.deletedCount} gift boxes`);
  console.log('Remaining admin accounts:', admins);

  await mongoose.disconnect();
};

resetDemoData().catch((err) => {
  console.error(err);
  process.exit(1);
});
