import api from '../api/axios';

export const DEFAULT_REVIEWS = [
  {
    id: 'default-priya',
    _id: 'default-priya',
    name: 'Priya S.',
    rating: 5,
    text: 'The gift box looked beautiful and arrived right on time.',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'default-arjun',
    _id: 'default-arjun',
    name: 'Arjun M.',
    rating: 5,
    text: 'Easy to customize, and the packaging felt really premium.',
    createdAt: '2026-06-02T10:00:00.000Z',
  },
  {
    id: 'default-neha',
    _id: 'default-neha',
    name: 'Neha K.',
    rating: 4,
    text: 'Perfect for a last-minute surprise that still felt personal.',
    createdAt: '2026-06-03T10:00:00.000Z',
  },
];

const normalizeReview = (review) => ({
  ...review,
  id: review._id || review.id,
});

export const fetchReviews = async ({ fallbackToDefaults = true } = {}) => {
  try {
    const { data } = await api.get('/reviews');
    const reviews = Array.isArray(data.reviews) ? data.reviews.map(normalizeReview) : [];
    return reviews.length || !fallbackToDefaults ? reviews : DEFAULT_REVIEWS;
  } catch (error) {
    if (fallbackToDefaults) return DEFAULT_REVIEWS;
    throw error;
  }
};

export const createReview = async ({ name, rating, text }) => {
  const { data } = await api.post('/reviews', { name, rating, text });
  return normalizeReview(data.review);
};

export const deleteReview = async (reviewId) => {
  await api.delete(`/reviews/${reviewId}`);
};
