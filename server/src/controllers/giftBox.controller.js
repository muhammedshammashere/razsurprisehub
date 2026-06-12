import GiftBox from '../models/GiftBox.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getOrCreateDraft = async (userId) => {
  let box = await GiftBox.findOne({ user: userId, status: 'draft' }).populate(
    'items.product',
    'name price images category stock'
  );
  if (!box) {
    box = await GiftBox.create({ user: userId, items: [] });
    box = await box.populate('items.product', 'name price images category stock');
  }
  return box;
};

const validateDeliveryDate = (date) => {
  if (!date) return;
  const delivery = new Date(date);
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (delivery < tomorrow) {
    throw new ApiError(400, 'Delivery date must be at least tomorrow');
  }
};

const parseQuantity = (quantity) => {
  const parsed = Number(quantity);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ApiError(400, 'Valid quantity required');
  }
  return parsed;
};

export const getGiftBox = asyncHandler(async (req, res) => {
  const box = await getOrCreateDraft(req.user._id);
  res.json({ success: true, giftBox: box });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) throw new ApiError(400, 'productId is required');
  const parsedQuantity = parseQuantity(quantity);

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock < parsedQuantity) throw new ApiError(400, 'Insufficient stock');

  const box = await getOrCreateDraft(req.user._id);
  const existing = box.items.find((i) => {
    const pid = i.product?._id?.toString() || i.product?.toString();
    return pid === productId;
  });
  if (existing) {
    existing.quantity += parsedQuantity;
    if (existing.quantity > product.stock) {
      throw new ApiError(400, 'Insufficient stock');
    }
  } else {
    box.items.push({
      product: product._id,
      quantity: parsedQuantity,
      unitPrice: product.price,
    });
  }

  box.recalculate();
  await box.save();
  await box.populate('items.product', 'name price images category stock');

  res.json({ success: true, giftBox: box });
});

export const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const parsedQuantity = parseQuantity(quantity);

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (parsedQuantity > product.stock) throw new ApiError(400, 'Insufficient stock');

  const box = await getOrCreateDraft(req.user._id);
  const item = box.items.find((i) => {
    const pid = i.product?._id?.toString() || i.product?.toString();
    return pid === productId;
  });
  if (!item) throw new ApiError(404, 'Item not in gift box');

  item.quantity = parsedQuantity;
  box.recalculate();
  await box.save();
  await box.populate('items.product', 'name price images category stock');

  res.json({ success: true, giftBox: box });
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const box = await getOrCreateDraft(req.user._id);
  box.items = box.items.filter((i) => {
    const pid = i.product?._id?.toString() || i.product?.toString();
    return pid !== productId;
  });
  box.recalculate();
  await box.save();
  await box.populate('items.product', 'name price images category stock');

  res.json({ success: true, giftBox: box });
});

export const updateGiftBox = asyncHandler(async (req, res) => {
  const { personalizedMessage, deliveryDate } = req.body;
  validateDeliveryDate(deliveryDate);

  const box = await getOrCreateDraft(req.user._id);
  if (personalizedMessage !== undefined) box.personalizedMessage = personalizedMessage;
  if (deliveryDate) box.deliveryDate = deliveryDate;

  box.recalculate();
  await box.save();
  await box.populate('items.product', 'name price images category stock');

  res.json({ success: true, giftBox: box });
});

export const clearGiftBox = asyncHandler(async (req, res) => {
  const box = await getOrCreateDraft(req.user._id);
  box.items = [];
  box.personalizedMessage = '';
  box.deliveryDate = undefined;
  box.recalculate();
  await box.save();
  res.json({ success: true, giftBox: box });
});
