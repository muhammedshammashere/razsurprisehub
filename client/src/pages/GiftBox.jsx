import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGiftBox } from '../context/GiftBoxContext';
import Loader from '../components/ui/Loader';
import { formatCurrency, getImageUrl } from '../utils/formatCurrency';

export default function GiftBox() {
  const { giftBox, loading, fetchGiftBox, updateItem, removeItem, updateBox } = useGiftBox();
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    fetchGiftBox();
  }, [fetchGiftBox]);

  useEffect(() => {
    if (giftBox) {
      setMessage(giftBox.personalizedMessage || '');
      if (giftBox.deliveryDate) {
        setDeliveryDate(new Date(giftBox.deliveryDate).toISOString().split('T')[0]);
      }
    }
  }, [giftBox]);

  const minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const saveDetails = async () => {
    await updateBox({ personalizedMessage: message, deliveryDate });
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
              <p className="text-gray-500">Your gift box is empty.</p>
              <Link to="/shop" className="btn-primary mt-4 inline-block">
                Browse products
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const p = item.product;
              return (
                <div key={p._id} className="card flex gap-4 flex-col sm:flex-row sm:items-center">
                  <img
                    src={getImageUrl(p.images?.[0]?.url)}
                    alt={p.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={p.stock}
                      value={item.quantity}
                      onChange={async (e) => {
                        await updateItem(p._id, Number(e.target.value));
                      }}
                      className="input-field w-20"
                    />
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
              className="input-field"
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
