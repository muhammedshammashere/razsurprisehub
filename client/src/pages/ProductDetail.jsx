import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useGiftBox } from '../context/GiftBoxContext';
import Loader from '../components/ui/Loader';
import { getImageUrl } from '../utils/formatCurrency';
import { CATEGORY_EMOJIS } from '../utils/constants';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { user } = useAuth();
  const { addItem, fetchGiftBox, getAvailableStock } = useGiftBox();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
  }, [id]);

  useEffect(() => {
    if (user) fetchGiftBox();
  }, [fetchGiftBox, user]);

  const availableStock = product ? getAvailableStock(product) : 0;

  useEffect(() => {
    if (product && qty > availableStock) {
      setQty(Math.max(availableStock, 1));
    }
  }, [availableStock, product, qty]);

  const handleAdd = async () => {
    if (!user) return toast.error('Please login first');
    if (availableStock < 1) return toast.error('Out of stock');
    if (qty > availableStock) return toast.error(`Only ${availableStock} left in stock`);
    try {
      await addItem(product._id, qty);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!product) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/shop" className="text-sm text-brand-600 hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-gray-900 sm:min-h-[420px]">
          <img
            src={getImageUrl(product.images?.[0]?.url)}
            alt={product.name}
            className="max-h-[520px] w-full object-contain"
          />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-900/30 dark:text-brand-300 px-2.5 py-1 rounded flex items-center gap-1.5 w-fit">
            <span>{CATEGORY_EMOJIS[product.category] || '🎁'}</span>
            <span>{product.category}</span>
          </span>
          <h1 className="mt-4 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">Stock: {availableStock}</p>
          <div className="mt-8 flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={availableStock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="input-field w-24"
              disabled={availableStock < 1}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={availableStock < 1}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {availableStock < 1 ? 'Out of Stock' : 'Add to Gift Box'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
