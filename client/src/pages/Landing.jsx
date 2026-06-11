import { Link } from 'react-router-dom';
import ReviewSection from '../components/reviews/ReviewSection';
import { CATEGORIES, CATEGORY_EMOJIS } from '../utils/constants';

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/40 py-20 dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-900/20 sm:py-28">
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
        <div className="absolute left-[20%] bottom-[10%] animate-pulse text-4xl opacity-50 duration-[3500ms] dark:opacity-35 select-none pointer-events-none" style={{ animationDelay: '0.5s' }}>
          🧸
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500 bg-brand-100/60 dark:bg-brand-900/30 dark:text-brand-300 px-3 py-1.5 rounded-full inline-block">
             Curated surprise gifts 
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold text-gray-900 dark:text-white sm:text-6xl tracking-tight">
            Build the perfect
            <span className="block mt-2 bg-gradient-to-r from-brand-500 to-brand-900 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-200">
              gift box
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Mix chocolates, flowers, cards, teddy bears, perfumes and custom gifts. Add a personal
            message, pick a delivery date, and checkout securely via WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/gift-box" className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-brand-500/20 hover:scale-[1.03] transition-transform">
              Start Building 
            </Link>
            <Link to="/shop" className="btn-secondary text-lg px-8 py-3 hover:scale-[1.03] transition-transform">
              Browse Shop 
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20 bg-white dark:bg-brand-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-gray-900 dark:text-white">
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
                className="card flex items-center justify-between transition-all duration-300 hover:border-brand-400/80 hover:shadow-lg hover:-translate-y-1 group"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                  <span className="text-2xl transition-transform group-hover:scale-125 duration-300">
                    {CATEGORY_EMOJIS[cat] || '🎁'}
                  </span>
                  <span>{cat}</span>
                </span>
                <span className="text-brand-500 transition-transform group-hover:translate-x-1 duration-200 font-bold text-lg">
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
      <section className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 dark:opacity-10 dark:bg-[radial-gradient(circle_at_top,_rgba(236,64,122,0.18),transparent_35%)] dark:[background-size:22px_22px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 z-10">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm">
            Four simple steps to send a customized box full of love and surprise
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white/90 dark:border-slate-800/60 dark:bg-slate-950/80 p-6 backdrop-blur-md transition-all hover:-translate-y-1">
              <div className="text-4xl">🛍️</div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">1. Pick Products</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Select your favorite items from chocolates, cards, teddy bears, and perfumes.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 dark:border-slate-800/60 dark:bg-slate-950/80 p-6 backdrop-blur-md transition-all hover:-translate-y-1">
              <div className="text-4xl">🎁</div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">2. Build Your Box</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Add the selected items into your custom surprise gift box with a single tap.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 dark:border-slate-800/60 dark:bg-slate-950/80 p-6 backdrop-blur-md transition-all hover:-translate-y-1">
              <div className="text-4xl">✍️</div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">3. Personalize</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Add a customized message, specify a delivery date, and add final instructions.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 dark:border-slate-800/60 dark:bg-slate-950/80 p-6 backdrop-blur-md transition-all hover:-translate-y-1">
              <div className="text-4xl">💬</div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-slate-100">4. Checkout</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Confirm details and connect automatically to WhatsApp to complete your payment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
