export const REVIEWS_STORAGE_KEY = 'sv_reviews';

export const DEFAULT_REVIEWS = [
  {
    id: 'default-priya',
    name: 'Priya S.',
    rating: 5,
    text: 'The gift box looked beautiful and arrived right on time.',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'default-arjun',
    name: 'Arjun M.',
    rating: 5,
    text: 'Easy to customize, and the packaging felt really premium.',
    createdAt: '2026-06-02T10:00:00.000Z',
  },
  {
    id: 'default-neha',
    name: 'Neha K.',
    rating: 4,
    text: 'Perfect for a last-minute surprise that still felt personal.',
    createdAt: '2026-06-03T10:00:00.000Z',
  },
  {
    id: 'default-fathima',
    name: 'Fathima R.',
    rating: 5,
    text: 'The birthday box was packed so neatly. The chocolates and teddy made it feel extra special.',
    createdAt: '2026-06-04T10:00:00.000Z',
  },
  {
    id: 'default-vishnu',
    name: 'Vishnu P.',
    rating: 4,
    text: 'Good selection of gifts and the WhatsApp checkout was very simple.',
    createdAt: '2026-06-05T10:00:00.000Z',
  },
  {
    id: 'default-aisha',
    name: 'Aisha M.',
    rating: 5,
    text: 'Loved the custom message option. It made the gift feel thoughtful and personal.',
    createdAt: '2026-06-06T10:00:00.000Z',
  },
  {
    id: 'default-rahul',
    name: 'Rahul N.',
    rating: 4,
    text: 'Nice experience overall. I would like to see more perfume options, but the box looked premium.',
    createdAt: '2026-06-07T10:00:00.000Z',
  },
  {
    id: 'default-meera',
    name: 'Meera J.',
    rating: 5,
    text: 'The flowers and card combo was beautiful. My sister absolutely loved the surprise.',
    createdAt: '2026-06-08T10:00:00.000Z',
  },
  {
    id: 'default-adil',
    name: 'Adil C.',
    rating: 3,
    text: 'The gift was good and easy to order. Delivery timing could be clearer, but support was helpful.',
    createdAt: '2026-06-09T10:00:00.000Z',
  },
  {
    id: 'default-sneha',
    name: 'Sneha V.',
    rating: 5,
    text: 'Very cute packaging. It looked much better than a regular gift hamper.',
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'default-nikhil',
    name: 'Nikhil T.',
    rating: 4,
    text: 'Simple to build a box and the categories made choosing items quick.',
    createdAt: '2026-06-11T10:00:00.000Z',
  },
];

const isValidReview = (review) =>
  review &&
  typeof review.name === 'string' &&
  typeof review.text === 'string' &&
  Number.isFinite(Number(review.rating));

const withStableIds = (reviews) =>
  reviews.map((review, index) => ({
    ...review,
    id: review.id || `review-${index}-${review.name.replace(/\s+/g, '-').toLowerCase()}`,
  }));

export const getReviews = () => {
  if (typeof window === 'undefined') return withStableIds(DEFAULT_REVIEWS);

  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw === null) return withStableIds(DEFAULT_REVIEWS);

    const savedReviews = JSON.parse(raw);
    if (!Array.isArray(savedReviews) || !savedReviews.every(isValidReview)) {
      return withStableIds(DEFAULT_REVIEWS);
    }

    return withStableIds(savedReviews);
  } catch {
    return withStableIds(DEFAULT_REVIEWS);
  }
};

export const saveReviews = (reviews) => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('sv:reviews-updated', { detail: reviews }));
};

export const deleteReview = (reviewId) => {
  const nextReviews = getReviews().filter((review) => review.id !== reviewId);
  saveReviews(nextReviews);
  return nextReviews;
};

export const updateReview = (reviewId, updates) => {
  const nextReviews = getReviews().map((review) =>
    review.id === reviewId ? { ...review, ...updates } : review
  );
  saveReviews(nextReviews);
  return nextReviews;
};
