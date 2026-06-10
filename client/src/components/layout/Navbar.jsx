import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGiftBox } from '../../context/GiftBoxContext';
import ThemeToggle from './ThemeToggle';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'text-brand-500 dark:text-brand-400 font-semibold scale-105'
      : 'text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400'
  }`;

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useGiftBox();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/50 bg-white/90 backdrop-blur dark:border-brand-900/30 dark:bg-brand-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-xl font-bold text-brand-500 hover:scale-[1.02] transition-transform dark:text-brand-400 shrink-0 flex items-center gap-1.5">
          <span>🎁</span>
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
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 md:hidden transition-colors"
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
        <div className="border-t border-brand-100/50 bg-white/95 px-6 py-4 shadow-lg dark:border-brand-900/30 dark:bg-brand-950/95 md:hidden flex flex-col gap-4 animate-fadeIn">
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
