export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-900/10 bg-white/70 p-4 shadow-md animate-pulse dark:border-brand-400/15 dark:bg-white/5"
          >
            {/* Image Placeholder */}
            <div className="h-48 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
            {/* Category Placeholder */}
            <div className="mt-4 h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
            {/* Title Placeholder */}
            <div className="mt-2 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            {/* Description Placeholder */}
            <div className="mt-2 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
            {/* Price & Button Placeholder */}
            <div className="mt-6 flex items-center justify-between">
              <div className="h-6 w-1/5 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-brand-900/10 bg-white/70 p-4 animate-pulse dark:border-brand-400/15 dark:bg-white/5"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Image Circle */}
              <div className="h-16 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2 flex-1">
                {/* Title */}
                <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                {/* Subtitle */}
                <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            {/* Action button */}
            <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  );
}
