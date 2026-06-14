import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteReview, getReviews } from '../../utils/reviews';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isActive = index + 1 <= rating;
        return (
          <svg
            key={index}
            className={`h-4 w-4 ${isActive ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-slate-300'}`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
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

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState(getReviews);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (review) => {
    const reviewId = review.id;
    if (!reviewId) {
      toast.error('Cannot delete this review');
      return;
    }

    if (!window.confirm(`Delete review from "${review.name}"? This cannot be undone.`)) return;

    setDeletingId(reviewId);
    try {
      const nextReviews = deleteReview(reviewId);
      setReviews(nextReviews);
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Reviews
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Customer Reviews
          </h1>
        </div>
        <Link to="/admin" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total reviews</p>
          <p className="mt-2 text-2xl font-bold">{reviews.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500 dark:text-slate-400">Average rating</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-2xl font-bold">{averageRating}</p>
            <Stars rating={Math.round(Number(averageRating))} />
          </div>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500 dark:text-slate-400">Latest review</p>
          <p className="mt-2 truncate text-sm font-semibold">
            {reviews[0]?.name || 'No reviews yet'}
          </p>
        </div>
      </div>

      <div className="mt-8 card overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-950 dark:text-white">All reviews</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Remove inappropriate or spam reviews below.</p>
        </div>

        {reviews.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No reviews yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left dark:border-slate-800 dark:bg-slate-900/50">
                  <th className="px-6 py-3 font-medium text-slate-600 dark:text-slate-300">Customer</th>
                  <th className="px-6 py-3 font-medium text-slate-600 dark:text-slate-300">Rating</th>
                  <th className="px-6 py-3 font-medium text-slate-600 dark:text-slate-300">Review</th>
                  <th className="px-6 py-3 font-medium text-slate-600 dark:text-slate-300">Date</th>
                  <th className="px-6 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-6 py-4 font-medium text-slate-950 dark:text-white">
                      {review.name}
                    </td>
                    <td className="px-6 py-4">
                      <Stars rating={Number(review.rating)} />
                    </td>
                    <td className="max-w-xs px-6 py-4 text-slate-600 dark:text-slate-300">
                      <span className="line-clamp-2">&ldquo;{review.text}&rdquo;</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(review)}
                        disabled={deletingId === review.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete review from ${review.name}`}
                      >
                        <TrashIcon />
                        {deletingId === review.id ? 'Deleting...' : 'Delete review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
