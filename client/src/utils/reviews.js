import api from '../api/axios';

const DEV_API_BASE = 'http://localhost:5000/api';

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

const shouldRetryWithDevServer = (error) =>
  import.meta.env.DEV && error.message?.includes('Not found - /api/reviews');

const requestReviewsFromDevServer = async (path = '/reviews', options = {}) => {
  const token = localStorage.getItem('sv_token');
  const response = await fetch(`${DEV_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const fetchReviews = async ({ fallbackToDefaults = true } = {}) => {
  try {
    const { data } = await api.get('/reviews');
    const reviews = Array.isArray(data.reviews) ? data.reviews.map(normalizeReview) : [];
    return reviews.length || !fallbackToDefaults ? reviews : DEFAULT_REVIEWS;
  } catch (error) {
    if (shouldRetryWithDevServer(error)) {
      const data = await requestReviewsFromDevServer('/reviews');
      const reviews = Array.isArray(data.reviews) ? data.reviews.map(normalizeReview) : [];
      return reviews.length || !fallbackToDefaults ? reviews : DEFAULT_REVIEWS;
    }

    if (fallbackToDefaults) return DEFAULT_REVIEWS;
    throw error;
  }
};

export const createReview = async ({ name, rating, text }) => {
  try {
    const { data } = await api.post('/reviews', { name, rating, text });
    return normalizeReview(data.review);
  } catch (error) {
    if (shouldRetryWithDevServer(error)) {
      const data = await requestReviewsFromDevServer('/reviews', {
        method: 'POST',
        body: JSON.stringify({ name, rating, text }),
      });
      return normalizeReview(data.review);
    }

    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await api.delete(`/reviews/${reviewId}`);
  } catch (error) {
    if (shouldRetryWithDevServer(error)) {
      await requestReviewsFromDevServer(`/reviews/${reviewId}`, { method: 'DELETE' });
      return;
    }

    throw error;
  }
};
