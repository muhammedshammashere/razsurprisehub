import { Link } from 'react-router-dom';

function WhatsAppIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.45-8.42ZM12.1 21.76h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.82 9.82 0 0 1-1.5-5.24C2.21 6.41 6.65 2 12.1 2a9.8 9.8 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 7c0 5.44-4.43 9.86-9.88 9.86Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function InstagramIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.9c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.3 2.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-900/10 bg-brand-50/30 py-12 text-slate-600 backdrop-blur dark:border-brand-900/30 dark:bg-brand-950/90 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="flex items-center gap-1.5 font-display text-lg font-bold text-brand-500 dark:text-brand-400">
              <span>Raz Surprise Hub</span>
            </h3>
            <p className="text-xs leading-relaxed">
              Mix and match chocolates, flowers, cards, teddy bears, and perfumes to build the
              ultimate custom surprise gift box. Delivered with love.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="transition-colors hover:text-brand-500">
                 🛒Shop Gifts
                </Link>
              </li>
              <li>
                <Link to="/gift-box" className="transition-colors hover:text-brand-500">
                  🎁Gift Box Builder
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition-colors hover:text-brand-500">
                  📦Order History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Support Details
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="tel:+917907549067" className="flex items-center gap-1.5 transition-colors hover:text-brand-500">
                  <PhoneIcon className="h-3.5 w-3.5 text-blue-500" />
                  <span>+91 79075 49067</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/7907549067" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-brand-500">
                  <WhatsAppIcon className="h-3.5 w-3.5 text-green-500" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/riyadh_surprise_gifts?igsh=MWd1c2J1YzV4Z3RlMQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-brand-500">
                  <InstagramIcon className="h-3.5 w-3.5 text-pink-500" />
                  <span>@riyadh_surprise_gifts</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@razsurprisehub.com"
                  className="flex items-center gap-1.5 transition-colors hover:text-brand-500"
                >
                  <MailIcon className="h-3.5 w-3.5 text-amber-500" />
                  <span>support@razsurprisehub.com</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Store & Delivery
            </h4>
            <ul className="space-y-2 text-xs leading-relaxed">
              <li>
                <span className="font-medium text-slate-900 dark:text-slate-200">Support Hours:</span>
                <span className="block text-[11px]">Open 24 hours</span>
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-slate-200">Delivery:</span>
                <span className="block text-[11px]">Delivery all over saudi arabia</span>
              </li>
              <li>
                <span className="block text-[11px]">Calicut, Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-brand-900/10 pt-6 text-center text-xs dark:border-brand-900/20">
          <p>Copyright &copy; {new Date().getFullYear()} Raz Surprise Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
