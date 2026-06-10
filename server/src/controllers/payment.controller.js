import crypto from 'crypto';
import Order from '../models/Order.js';
import { getRazorpay } from '../config/razorpay.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { confirmOrderPaid } from './order.controller.js';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) throw new ApiError(400, 'orderId is required');

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }
  if (order.status !== 'pending') {
    throw new ApiError(400, 'Order is not payable');
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    throw new ApiError(503, 'Payment gateway not configured');
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100),
    currency: 'INR',
    receipt: order.orderNumber,
    notes: { orderId: order._id.toString() },
  });

  order.payment = order.payment || {};
  order.payment.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    order: {
      id: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
    },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, 'Missing payment verification fields');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expected !== razorpay_signature) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  order.payment = {
    ...order.payment,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paidAt: new Date(),
  };

  await order.save();
  const paidOrder = await confirmOrderPaid(order._id);

  res.json({
    success: true,
    message: 'Payment verified successfully',
    order: paidOrder,
  });
});
