import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useGiftBox } from '../context/GiftBoxContext';
import Loader from '../components/ui/Loader';
import { formatCurrency, getImageUrl } from '../utils/formatCurrency';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { user } = useAuth();
  const { addItem } = useGiftBox();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
  }, [id]);

  const handleAdd = async () => {
    if (!user) return toast.error('Please login first');
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
        <img
          src={getImageUrl(product.images?.[0]?.url)}
          alt={product.name}
          className="rounded-xl object-cover w-full max-h-[480px]"
        />
        <div>
          <span className="text-sm font-medium text-brand-600">{product.category}</span>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">Stock: {product.stock}</p>
          <div className="mt-8 flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="input-field w-24"
            />
            <button type="button" onClick={handleAdd} className="btn-primary">
              Add to Gift Box
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
