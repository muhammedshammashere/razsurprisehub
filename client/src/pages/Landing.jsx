import { Link } from 'react-router-dom';
import ReviewSection from '../components/reviews/ReviewSection';
import { CATEGORIES } from '../utils/constants';

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-pink-100/50 py-20 dark:from-slate-900 dark:via-slate-950 dark:to-brand-950/20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Curated surprise gifts
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl">
            Build the perfect
            <span className="block text-brand-600">gift box</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Mix chocolates, flowers, cards, teddy bears, perfumes and custom gifts. Add a personal
            message, pick a delivery date, and checkout securely via WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/gift-box" className="btn-primary text-lg px-8 py-3">
              Start Building
            </Link>
            <Link to="/shop" className="btn-secondary text-lg px-8 py-3">
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Shop by category
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="card flex items-center justify-between transition hover:border-brand-300 hover:shadow-md"
              >
                <span className="font-medium">{cat}</span>
                <span className="text-brand-600">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ReviewSection />

      <section className="bg-brand-600 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold">How it works</h2>
          <ol className="mt-8 space-y-4 text-left text-brand-50">
            <li>1. Pick products from our curated categories</li>
            <li>2. Build your custom gift box with your favorite items</li>
            <li>3. Add a personalized message and delivery date</li>
            <li>4. Confirm your order and checkout via WhatsApp</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
