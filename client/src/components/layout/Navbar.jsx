import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGiftBox } from '../../context/GiftBoxContext';
import ThemeToggle from './ThemeToggle';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'text-brand-500 dark:text-brand-300 font-semibold scale-105'
      : 'text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-300'
  }`;

const iconLinkClass = ({ isActive }) =>
  `relative rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 md:hidden ${
    isActive
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
      : 'text-slate-600 hover:bg-white/80 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
  }`;

function CartIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function DeliveryBoxIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 9h16v11H4V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 9l8-4 8 4"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 14h16" />
    </svg>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useGiftBox();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frameId = null;

    const updateScrollState = () => {
      frameId = null;
      setIsScrolled(window.scrollY > 8);
    };

    const onScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const headerClass = [
    'sticky top-0 z-40 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out',
    isScrolled
      ? 'border-b border-brand-900/10 bg-brand-50/75 shadow-lg shadow-brand-900/10 backdrop-blur-lg dark:border-brand-400/20 dark:bg-brand-950/70 dark:shadow-black/30'
      : 'border-b border-transparent bg-transparent shadow-none backdrop-blur-0',
  ].join(' ');

  return (
    <header className={headerClass}>
      <div className="h-0.5 w-full brand-gradient" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 font-display text-xl font-extrabold text-secondary transition-all duration-300 hover:scale-[1.02] hover:text-brand-800 dark:text-brand-100 dark:drop-shadow-[0_0_14px_rgba(236,64,122,0.18)] dark:hover:text-white"
        >
          <span>Raz Surprise Hub</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/gift-box" className={linkClass}>
            Gift Box {itemCount > 0 && `(${itemCount})`}
          </NavLink>
          {user && (
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <NavLink
            to="/gift-box"
            className={iconLinkClass}
            aria-label={itemCount > 0 ? `Gift box, ${itemCount} items` : 'Gift box'}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </NavLink>
          {user && (
            <NavLink to="/orders" className={iconLinkClass} aria-label="My orders">
              <DeliveryBoxIcon />
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
