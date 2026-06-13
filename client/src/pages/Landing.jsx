import { Link } from 'react-router-dom';
import ReviewSection from '../components/reviews/ReviewSection';
import { CATEGORIES, CATEGORY_EMOJIS } from '../utils/constants';

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="surface-gradient relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px brand-gradient opacity-70" />
        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl dark:bg-brand-400/15" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-brand-900/10 blur-3xl dark:bg-white/10" />
        {/* Animated Floating Emojis */}
        <div className="absolute left-[10%] top-[20%] animate-bounce text-4xl opacity-50 duration-[4000ms] dark:opacity-35 select-none pointer-events-none" style={{ animationDelay: '0s' }}>
          🎈
        </div>
        <div className="absolute right-[12%] top-[30%] animate-bounce text-5xl opacity-50 duration-[5000ms] dark:opacity-35 select-none pointer-events-none" style={{ animationDelay: '1s' }}>
          💝
        </div>
        <div className="absolute right-[25%] bottom-[15%] animate-pulse text-3xl opacity-50 duration-[3000ms] dark:opacity-35 select-none pointer-events-none">
          ✨
        </div>
        <div className="absolute left-[20%] bottom-[10%] animate-bounce text-4xl opacity-50 duration-[3500ms] dark:opacity-35 select-none pointer-events-none" style={{ animationDelay: '0.5s' }}>
          🧸
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 z-10">
          <p className="inline-block rounded-full border border-brand-500/20 bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-900 shadow-sm backdrop-blur dark:border-brand-400/20 dark:bg-white/10 dark:text-brand-100">
             Curated surprise gifts 
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-brand-950 dark:text-white sm:text-6xl">
            Build the perfect
            <span className="text-gradient mt-2 block">
              gift box
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-brand-50/85">
            Mix chocolates, flowers, cards, teddy bears, perfumes and custom gifts. Add a personal
            message, pick a delivery date, and checkout securely via WhatsApp.
          </p>
          <div className="mt-10 flex justify-center">
            <Link to="/shop" className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-brand-500/20 hover:scale-[1.03] transition-transform">
              Start Building 
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-brand-950 dark:text-white">
            Shop by category
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Explore our curated items designed to spark joy
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="card group flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-lg"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                  <span className="text-2xl transition-transform group-hover:scale-125 duration-300">
                    {CATEGORY_EMOJIS[cat] || '🎁'}
                  </span>
                  <span>{cat}</span>
                </span>
                <span className="text-lg font-bold text-brand-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-900 dark:group-hover:text-brand-300">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Review Section */}
      <ReviewSection />

      {/* How It Works Section */}
      <section className="surface-gradient relative overflow-hidden py-20 text-slate-900 dark:text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px brand-gradient opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 z-10">
          <div className="rounded-3xl border border-brand-900/10 bg-white/80 p-10 shadow-xl shadow-brand-900/10 backdrop-blur dark:border-brand-400/20 dark:bg-white/10">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-brand-950 dark:text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm">
                Four simple steps to send a customized box full of love and surprise
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-brand-900/10 bg-white/75 p-6 shadow-sm shadow-brand-900/5 transition-all hover:-translate-y-1 dark:border-brand-400/20 dark:bg-white/10">
                <div className="text-4xl">🛍️</div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">1. Pick Products</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Select your favorite items from chocolates, cards, teddy bears, and perfumes.
                </p>
              </div>

              <div className="rounded-3xl border border-brand-900/10 bg-white/75 p-6 shadow-sm shadow-brand-900/5 transition-all hover:-translate-y-1 dark:border-brand-400/20 dark:bg-white/10">
                <div className="text-4xl">🎁</div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">2. Build Your Box</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Add the selected items into your custom surprise gift box with a single tap.
                </p>
              </div>

              <div className="rounded-3xl border border-brand-900/10 bg-white/75 p-6 shadow-sm shadow-brand-900/5 transition-all hover:-translate-y-1 dark:border-brand-400/20 dark:bg-white/10">
                <div className="text-4xl">✍️</div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">3. Personalize</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Add a customized message, specify a delivery date, and add final instructions.
                </p>
              </div>

              <div className="rounded-3xl border border-brand-900/10 bg-white/75 p-6 shadow-sm shadow-brand-900/5 transition-all hover:-translate-y-1 dark:border-brand-400/20 dark:bg-white/10">
                <div className="text-4xl">💬</div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">4. Checkout</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Confirm details and connect automatically to WhatsApp to complete your payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
