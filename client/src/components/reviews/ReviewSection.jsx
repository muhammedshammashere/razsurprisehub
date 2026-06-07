import { useEffect, useMemo, useState } from 'react';
import { getReviews, saveReviews } from '../../utils/reviews';

function Stars({ rating, onChange, size = 'h-5 w-5' }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const isActive = value <= rating;
        const className = `${size} transition-colors ${
          isActive ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-slate-300'
        }`;

        if (onChange) {
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={`Rate ${value} stars`}
            >
              <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M10 1.9l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.2l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L10 1.9z"
                />
              </svg>
            </button>
          );
        }

        return (
          <svg key={value} className={className} viewBox="0 0 20 20" aria-hidden="true">
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M10 1.9l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.2l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L10 1.9z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function ReviewMarqueeChip({ review }) {
  return (
    <article className="review-marquee-chip">
      <div className="review-marquee-stars">
        <Stars rating={Number(review.rating)} size="h-4 w-4" />
      </div>
      <p className="review-marquee-quote">&ldquo;{review.text}&rdquo;</p>
      <p className="review-marquee-author">
        <span className="review-marquee-name">{review.name}</span>
      </p>
    </article>
  );
}

function buildMarqueeLoop(reviews) {
  if (!reviews.length) return [];

  let expanded = [...reviews];
  while (expanded.length < 8) {
    expanded = [...expanded, ...reviews];
  }
  return [...expanded, ...expanded];
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState(getReviews);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const syncReviews = () => setReviews(getReviews());

    window.addEventListener('storage', syncReviews);
    window.addEventListener('sv:reviews-updated', syncReviews);
    return () => {
      window.removeEventListener('storage', syncReviews);
      window.removeEventListener('sv:reviews-updated', syncReviews);
    };
  }, []);

  const averageRating = useMemo(() => {
    const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return reviews.length ? (total / reviews.length).toFixed(1) : '0.0';
  }, [reviews]);

  const marqueeItems = useMemo(() => buildMarqueeLoop(reviews), [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !message.trim()) return;

    const nextReviews = [
      {
        id: `review-${Date.now()}`,
        name: name.trim() || 'Happy Customer',
        rating,
        text: message.trim(),
        createdAt: new Date().toISOString(),
      },
      ...reviews,
    ];

    setReviews(nextReviews);
    saveReviews(nextReviews);
    setRating(0);
    setName('');
    setMessage('');
  };

  return (
    <section className="bg-white py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-lg border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-rose-50 p-6 shadow-sm dark:border-brand-950/50 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Reviews & ratings
              </p>
              <h2 className="mt-2 max-w-2xl text-3xl font-bold text-slate-950 dark:text-white">
                Loved by customers who build meaningful surprise gifts
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Real notes from people building surprise boxes for birthdays, anniversaries, and
                last-minute little saves.
              </p>
            </div>

            <div className="rounded-lg border border-white/80 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-end gap-3">
                <span className="font-display text-5xl font-bold text-slate-950 dark:text-white">
                  {averageRating}
                </span>
                <div className="pb-1">
                  <Stars rating={Math.round(Number(averageRating))} />
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {reviews.length} reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">Rate your visit</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Tell us how the gifting experience felt.
                </p>
              </div>
              <Stars rating={rating} onChange={setRating} size="h-7 w-7" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
              />
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
                placeholder="Share your review"
                required
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={!rating || !message.trim()}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </form>

          <div className="mt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              What customers are saying
            </p>
            {reviews.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Be the first to leave a review.
              </p>
            ) : (
              <div className="review-marquee" aria-label="Customer reviews marquee">
                <div className="review-marquee-fade review-marquee-fade--left" />
                <div className="review-marquee-fade review-marquee-fade--right" />
                <div className="review-marquee-track">
                  {marqueeItems.map((review, index) => (
                    <ReviewMarqueeChip key={`${review.id}-${index}`} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
