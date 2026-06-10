import Order from '../models/Order.js';
import GiftBox from '../models/GiftBox.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  const box = await GiftBox.findOne({ user: req.user._id, status: 'draft' }).populate(
    'items.product'
  );
  if (!box || box.items.length === 0) {
    throw new ApiError(400, 'Gift box is empty');
  }
  if (!box.deliveryDate) {
    throw new ApiError(400, 'Please select a delivery date');
  }

  for (const item of box.items) {
    const product = item.product;
    if (!product?.isActive || product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product?.name || 'product'}`);
    }
  }

  const subtotal = box.subtotal;
  const packagingFee = box.packagingFee || 99;
  const deliveryFee = 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + packagingFee + deliveryFee + tax;

  const orderItems = box.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.unitPrice,
  }));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    giftBox: box._id,
    personalizedMessage: box.personalizedMessage,
    deliveryDate: box.deliveryDate,
    shippingAddress: shippingAddress || req.user.address,
    subtotal,
    packagingFee,
    deliveryFee,
    tax,
    total,
    status: 'pending',
  });

  for (const item of box.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }
  box.status = 'converted';
  await box.save();
  await GiftBox.create({ user: req.user._id, items: [], status: 'draft' });

  res.status(201).json({ success: true, order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images');
  res.json({ success: true, orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'items.product',
    'name images category'
  );
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  res.json({ success: true, order });
});

export const confirmOrderPaid = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order || order.status !== 'pending') return order;

  order.status = 'paid';
  await order.save();
  return order;
};
