import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useGiftBox } from '../context/GiftBoxContext';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/ui/Loader';
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shop Gifts</h1>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              !category
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                : 'bg-brand-50/50 hover:bg-brand-100 text-gray-700 border border-brand-100/50 dark:bg-brand-900/10 dark:text-brand-300 dark:border-brand-900/30 dark:hover:bg-brand-900/20'
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
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                  : 'bg-brand-50/50 hover:bg-brand-100 text-gray-700 border border-brand-100/50 dark:bg-brand-900/10 dark:text-brand-300 dark:border-brand-900/30 dark:hover:bg-brand-900/20'
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
        <Loader />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={user ? handleAdd : null} />
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <p className="py-12 text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
}
