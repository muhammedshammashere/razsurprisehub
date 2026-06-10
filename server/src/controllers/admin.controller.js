import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenueAgg, ordersByStatus] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      revenue: revenueAgg[0]?.total || 0,
      ordersByStatus: ordersByStatus.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {}),
    },
    recentOrders,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email phone'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    orders,
    pagination: { page: Number(page), limit: Number(limit), total },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) throw new ApiError(400, 'Invalid status');

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const previousStatus = order.status;
  if (status === previousStatus) {
    return res.json({ success: true, order });
  }

  if (status === 'cancelled' && previousStatus !== 'cancelled') {
    for (const item of order.items) {
      if (item.product && item.quantity) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }
  } else if (previousStatus === 'cancelled' && status !== 'cancelled') {
    for (const item of order.items) {
      if (!item.product || !item.quantity) continue;
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${item.name || 'product'}`);
      }
    }
    for (const item of order.items) {
      if (item.product && item.quantity) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }
  }

  order.status = status;
  await order.save();

  res.json({ success: true, order });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) throw new ApiError(400, 'Invalid role');

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    '-password'
  );
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, user });
});

export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, products });
});
