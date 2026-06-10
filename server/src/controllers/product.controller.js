import Product, { CATEGORIES } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product deactivated' });
});

export const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image uploaded');
  const imageUrl = `/uploads/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { url: imageUrl } } },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});
