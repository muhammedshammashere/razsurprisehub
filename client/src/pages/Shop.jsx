import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useGiftBox } from '../context/GiftBoxContext';
import ProductCard from '../components/products/ProductCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { CATEGORIES, CATEGORY_EMOJIS } from '../utils/constants';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { addItem, fetchGiftBox } = useGiftBox();

  useEffect(() => {
    if (user) fetchGiftBox();
  }, [fetchGiftBox, user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, search]);

  const handleAdd = async (product) => {
    if (!user) {
      toast.error('Please login to add items');
      return;
    }
    try {
      await addItem(product._id, 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="surface-gradient rounded-2xl border border-brand-900/10 px-5 py-6 shadow-lg shadow-brand-900/5 dark:border-brand-400/20 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">
          Curated collection
        </p>
        <h1 className="mt-2 text-3xl font-bold text-brand-950 dark:text-white">Shop Gifts</h1>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              !category
                ? 'brand-gradient text-white shadow-md shadow-brand-500/25 scale-105'
                : 'border border-brand-900/10 bg-white/80 text-brand-900 hover:bg-brand-50 dark:border-brand-400/20 dark:bg-white/10 dark:text-brand-100 dark:hover:bg-white/20'
            }`}
          >
             All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSearchParams({ category: cat })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                category === cat
                  ? 'brand-gradient text-white shadow-md shadow-brand-500/25 scale-105'
                  : 'border border-brand-900/10 bg-white/80 text-brand-900 hover:bg-brand-50 dark:border-brand-400/20 dark:bg-white/10 dark:text-brand-100 dark:hover:bg-white/20'
              }`}
            >
              <span>{CATEGORY_EMOJIS[cat] || ''}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search products..."
          className="input-field max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={user ? handleAdd : null} />
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">No products found.</p>
      )}
    </div>
  );
}
