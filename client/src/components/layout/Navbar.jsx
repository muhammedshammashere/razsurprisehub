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

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useGiftBox();
  const [isOpen, setIsOpen] = useState(false);
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
      ? 'border-b border-brand-900/10 bg-white/75 shadow-lg shadow-brand-900/10 backdrop-blur-lg dark:border-brand-400/20 dark:bg-brand-950/70 dark:shadow-black/30'
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
        
        {/* Desktop Menu */}
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-white/80 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div id="mobile-navigation" className="flex flex-col gap-4 border-t border-brand-900/10 bg-white/90 px-6 py-4 shadow-lg shadow-brand-900/10 backdrop-blur-lg dark:border-brand-400/20 dark:bg-brand-950/85 dark:shadow-black/30 md:hidden">
          <NavLink to="/shop" className={linkClass} onClick={() => setIsOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/gift-box" className={linkClass} onClick={() => setIsOpen(false)}>
            Gift Box {itemCount > 0 && `(${itemCount})`}
          </NavLink>
          {user && (
            <NavLink to="/orders" className={linkClass} onClick={() => setIsOpen(false)}>
              Orders
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
