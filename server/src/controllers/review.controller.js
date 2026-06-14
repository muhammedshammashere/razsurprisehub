import Review from '../models/Review.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isVisible: true }).sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim() || 'Happy Customer';
  const text = req.body.text?.trim();
  const rating = Number(req.body.rating);

  if (!text) throw new ApiError(400, 'Review message is required');
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5');
  }

  const review = await Review.create({ name, text, rating });
  res.status(201).json({ success: true, review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isVisible: false },
    { new: true }
  );

  if (!review) throw new ApiError(404, 'Review not found');
  res.json({ success: true, message: 'Review deleted' });
});
