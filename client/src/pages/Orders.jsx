import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';

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
        <p className="mt-8 text-gray-500 dark:text-gray-400">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:border-brand-300"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{order.orderNumber}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const itemsText = order.items
                      ?.map((item) => `- ${item.name || item.product?.name || 'Item'} (Qty: ${item.quantity})`)
                      .join('\n') || '';
                    const messageText = `Hello! I would like to place/confirm my order.

*Order Number:* ${order.orderNumber}
*Delivery Date:* ${new Date(order.deliveryDate).toLocaleDateString()}
*Personalized Message:* ${order.personalizedMessage ? `"${order.personalizedMessage}"` : 'None'}

*Items:*
${itemsText}`;
                    const whatsappUrl = `https://wa.me/7907549067?text=${encodeURIComponent(messageText)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5"
                >
                  💬 Connect WhatsApp
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
