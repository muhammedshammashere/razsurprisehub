import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext';
import { openRazorpayCheckout } from '../components/orders/RazorpayCheckout';

const STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

function WhatsAppIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.45-8.42ZM12.1 21.76h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.82 9.82 0 0 1-1.5-5.24C2.21 6.41 6.65 2 12.1 2a9.8 9.8 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 7c0 5.44-4.43 9.86-9.88 9.86Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [paying, setPaying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order));
  }, [id]);

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const { data } = await api.post('/payments/create-order', { orderId: id });
      
      await openRazorpayCheckout({
        keyId: data.keyId,
        razorpayOrderId: data.razorpayOrderId,
        amount: data.amount,
        orderId: id,
        user,
        onSuccess: async (verificationData) => {
          try {
            const verifyRes = await api.post('/payments/verify', verificationData);
            setOrder(verifyRes.data.order);
            toast.success('Payment completed successfully!');
          } catch (verifyErr) {
            toast.error(verifyErr.message || 'Payment verification failed');
          }
        },
        onFailure: (errMsg) => {
          toast.error(errMsg || 'Payment failed');
        }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment initialization failed');
    } finally {
      setPaying(false);
    }
  };

  if (!order) return <Loader />;

  const currentIndex = STEPS.indexOf(order.status === 'cancelled' ? 'pending' : order.status);

  const getWhatsAppUrl = () => {
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
      <Link to="/orders" className="text-sm text-brand-600 hover:underline dark:text-brand-300">
        &larr; All orders
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
          <h2 className="mb-4 font-semibold">Order tracking</h2>
          <div className="flex justify-between">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i <= currentIndex ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="mt-2 hidden text-center text-xs capitalize sm:block">
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 space-y-2 border-t border-brand-900/10 pt-6 dark:border-brand-400/15">
          <h3 className="mb-2 text-base font-semibold">Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
              <span className="font-medium text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
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

        {order.status === 'pending' && (
          <div className="mt-6 rounded-xl border border-brand-900/10 bg-white/60 p-5 shadow-sm dark:border-brand-400/15 dark:bg-white/5">
            <h3 className="font-semibold text-brand-950 dark:text-white">Pay Online Securely</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Complete payment instantly via UPI, Cards, Netbanking, or Wallet. Your order status will update in real-time.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={paying}
                className="btn-primary flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-75"
              >
                {paying ? 'Processing...' : `Pay ${formatCurrency(order.total || 0)} Now`}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-brand-900/10 pt-6 dark:border-brand-900/25 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Automatic redirect blocked? Use this button to complete payment and confirm details on WhatsApp.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap text-sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Confirm via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
