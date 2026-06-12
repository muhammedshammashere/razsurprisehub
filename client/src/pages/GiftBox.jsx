import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGiftBox } from '../context/GiftBoxContext';
import Loader from '../components/ui/Loader';
import { formatCurrency, getImageUrl } from '../utils/formatCurrency';

export default function GiftBox() {
  const { giftBox, loading, fetchGiftBox, updateItem, removeItem, updateBox, setGiftBox } = useGiftBox();
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [draftQuantities, setDraftQuantities] = useState({});
  const quantityTimers = useRef({});

  useEffect(() => {
    fetchGiftBox();
  }, [fetchGiftBox]);

  useEffect(() => {
    if (giftBox) {
      setMessage(giftBox.personalizedMessage || '');
      setDraftQuantities(
        (giftBox.items || []).reduce((quantities, item) => {
          const productId = item.product?._id || item.product;
          if (productId) quantities[productId] = item.quantity;
          return quantities;
        }, {})
      );
      if (giftBox.deliveryDate) {
        setDeliveryDate(new Date(giftBox.deliveryDate).toISOString().split('T')[0]);
      }
    }
  }, [giftBox]);

  useEffect(
    () => () => {
      Object.values(quantityTimers.current).forEach(clearTimeout);
    },
    []
  );

  const minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const saveDetails = async () => {
    await updateBox({ personalizedMessage: message, deliveryDate });
  };

  const persistQuantity = (productId, quantity) => {
    clearTimeout(quantityTimers.current[productId]);
    quantityTimers.current[productId] = setTimeout(async () => {
      try {
        await updateItem(productId, quantity, { skipSetGiftBox: true });
      } catch (err) {
        fetchGiftBox();
      }
    }, 180);
  };

  const updateQuantity = (productId, nextQuantity, stock) => {
    const quantity = Math.max(1, Math.min(Number(nextQuantity) || 1, stock || 1));
    setDraftQuantities((current) => ({ ...current, [productId]: quantity }));
    setGiftBox((current) => {
      if (!current) return current;
      const items = current.items.map((item) => {
        const itemProductId = item.product?._id || item.product;
        return itemProductId?.toString() === productId ? { ...item, quantity } : item;
      });
      const subtotal = items.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
      return {
        ...current,
        items,
        subtotal,
        total: subtotal + (current.packagingFee || 0),
      };
    });
    persistQuantity(productId, quantity);
  };

  if (loading && !giftBox) return <Loader />;

  const items = giftBox?.items || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Gift Box Builder</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Your gift box is empty.</p>
              <Link to="/shop" className="btn-primary mt-4 inline-block">
                Browse products
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const p = item.product;
              const quantity = draftQuantities[p._id] ?? item.quantity;
              return (
                <div key={p._id} className="card flex gap-4 flex-col sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-2 dark:bg-gray-900">
                    <img
                      src={getImageUrl(p.images?.[0]?.url)}
                      alt={p.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 items-center overflow-hidden rounded-lg border border-brand-900/10 bg-white dark:border-brand-400/15 dark:bg-white/5">
                      <button
                        type="button"
                        aria-label={`Decrease ${p.name} quantity`}
                        disabled={quantity <= 1}
                        onClick={() => updateQuantity(p._id, quantity - 1, p.stock)}
                        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        -
                      </button>
                      <span className="flex h-10 w-12 items-center justify-center border-x border-brand-900/10 text-sm font-semibold dark:border-brand-400/15">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${p.name} quantity`}
                        disabled={quantity >= p.stock}
                        onClick={() => updateQuantity(p._id, quantity + 1, p.stock)}
                        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(p._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="card h-fit space-y-4">
          <h2 className="font-bold text-lg">Personalization Details</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Personalized message</label>
            <textarea
              className="input-field min-h-[100px]"
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={saveDetails}
              placeholder="Write a heartfelt message..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Delivery date</label>
            <input
              type="date"
              min={minDate()}
              className="input-field date-field"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              onBlur={saveDetails}
            />
          </div>
          {items.length > 0 && (
            <Link
              to="/checkout"
              className="btn-primary block w-full text-center"
              onClick={saveDetails}
            >
              Proceed to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
