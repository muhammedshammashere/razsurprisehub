import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';

const STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order));
  }, [id]);

  if (!order) return <Loader />;

  const currentIndex = STEPS.indexOf(order.status === 'cancelled' ? 'pending' : order.status);

  const getWhatsAppUrl = () => {
    if (!order) return '';
    const itemsText = order.items
      .map((item) => `- ${item.name} (Qty: ${item.quantity})`)
      .join('\n');
    const messageText = `Hello! I would like to place/confirm my order.

*Order Number:* ${order.orderNumber}
*Delivery Date:* ${new Date(order.deliveryDate).toLocaleDateString()}
*Personalized Message:* ${order.personalizedMessage ? `"${order.personalizedMessage}"` : 'None'}

*Items:*
${itemsText}`;
    return `https://wa.me/7907549067?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/orders" className="text-sm text-brand-600 hover:underline">
        ← All orders
      </Link>
      <div className="mt-6 card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${ORDER_STATUS_COLORS[order.status]}`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Order tracking</h2>
          <div className="flex justify-between">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentIndex ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                >
                  {i + 1}
                </div>
                <span className="mt-2 text-xs text-center capitalize hidden sm:block">
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 space-y-2 border-t border-brand-900/10 pt-6 dark:border-brand-400/15">
          <h3 className="font-semibold text-base mb-2">Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
              <span className="text-gray-500 font-medium dark:text-gray-400">Qty: {item.quantity}</span>
            </div>
          ))}
        </div>
        {order.personalizedMessage && (
          <div className="mt-6 rounded-lg bg-brand-50 p-4 dark:bg-brand-950/30">
            <p className="text-sm font-medium text-brand-800 dark:text-brand-200">Your message</p>
            <p className="mt-1 italic">{order.personalizedMessage}</p>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
        </p>

        {/* WhatsApp Manual Fallback Link */}
        <div className="mt-8 pt-6 border-t border-brand-900/10 dark:border-brand-900/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Automatic redirect blocked? Use this button to complete payment and confirm details on WhatsApp.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap text-sm"
          >
            💬 Confirm via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
