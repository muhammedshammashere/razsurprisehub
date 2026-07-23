import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';

function WhatsAppIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.45-8.42ZM12.1 21.76h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.82 9.82 0 0 1-1.5-5.24C2.21 6.41 6.65 2 12.1 2a9.8 9.8 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 7c0 5.44-4.43 9.86-9.88 9.86Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

const getWhatsAppUrl = (order) => {
  const itemsText =
    order.items
      ?.map((item) => `- ${item.name || item.product?.name || 'Item'} (Qty: ${item.quantity})`)
      .join('\n') || '';

  const messageText = `Hello! I would like to place/confirm my order.

*Order Number:* ${order.orderNumber}
*Delivery Date:* ${new Date(order.deliveryDate).toLocaleDateString()}
*Personalized Message:* ${order.personalizedMessage ? `"${order.personalizedMessage}"` : 'None'}

*Items:*
${itemsText}`;

  return `https://wa.me/7907549067?text=${encodeURIComponent(messageText)}`;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <div className="card mt-8 text-center py-12 max-w-lg mx-auto flex flex-col items-center">
          <div className="text-5xl mb-4 select-none">🛍️</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">No orders found</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-gray-400 max-w-sm">
            It looks like you haven't built any surprise gift boxes yet. Start exploring our collection and create one!
          </p>
          <Link to="/shop" className="btn-primary mt-6 inline-block text-sm">
            Start Customizing Your Box
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card flex flex-col gap-4 hover:border-brand-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{order.orderNumber}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(getWhatsAppUrl(order), '_blank');
                  }}
                  className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-green-500" />
                  <span>Connect WhatsApp</span>
                </button>
                <span
                  className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
