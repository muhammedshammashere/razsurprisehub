import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-900/10 bg-brand-50/30 py-12 backdrop-blur dark:border-brand-900/30 dark:bg-brand-950/90 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1: Brand details */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-brand-500 dark:text-brand-400 flex items-center gap-1.5">
              <span>🎁</span>
              <span>Raz Surprise Hub</span>
            </h3>
            <p className="text-xs leading-relaxed">
              Mix and match chocolates, flowers, cards, teddy bears, and perfumes to build the ultimate custom surprise gift box. Delivered with love.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-brand-500 transition-colors">
                  🛒 Shop Gifts
                </Link>
              </li>
              <li>
                <Link to="/gift-box" className="hover:text-brand-500 transition-colors">
                  🎁 Gift Box Builder
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-500 transition-colors">
                  📦 Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-3">
              Support Details
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="tel:+917907549067" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  📞 +91 79075 49067
                </a>
              </li>
              <li>
                <a href="https://wa.me/7907549067" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  💬 Chat on WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/riyadh_surprise_gifts?igsh=MWd1c2J1YzV4Z3RlMQ==" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  📸 Instagram: @riyadh_surprise_gifts
                </a>
              </li>
              <li>
                <span className="flex items-center gap-1.5">
                  ✉️ support@razsurprisehub.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Delivery */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-3">
              Store & Delivery
            </h4>
            <ul className="space-y-2 text-xs leading-relaxed">
              <li>
                <span className="font-medium text-slate-900 dark:text-slate-200">Support Hours:</span>
                <span className="block text-[11px]">Daily 9:00 AM - 9:00 PM</span>
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-slate-200">Delivery Days:</span>
                <span className="block text-[11px]">All 7 Days a week</span>
              </li>
              <li>
                <span className="text-[11px] block">📍 Calicut, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-brand-900/10 dark:border-brand-900/20 pt-6 text-center text-xs">
          <p>
            Copyright &copy; {new Date().getFullYear()} Raz Surprise Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
