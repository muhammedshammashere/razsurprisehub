import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useGiftBox } from '../context/GiftBoxContext';
import Loader from '../components/ui/Loader';

export default function Checkout() {
  const { user } = useAuth();
  const { giftBox, fetchGiftBox } = useGiftBox();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchGiftBox();
  }, [fetchGiftBox]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!giftBox?.items?.length) return toast.error('Gift box is empty');
    if (!giftBox?.deliveryDate) return toast.error('Select delivery date in gift box');

    setProcessing(true);
    try {
      const { data: orderRes } = await api.post('/orders', {});
      const order = orderRes.order;

      toast.success('Order placed successfully! Redirecting to WhatsApp...');

      const itemsText = giftBox.items
        .map((item) => `- ${item.product.name} (Qty: ${item.quantity})`)
        .join('\n');

      const messageText = `Hello! I would like to place an order.

*Order Number:* ${order.orderNumber}
*Delivery Date:* ${new Date(order.deliveryDate).toLocaleDateString()}
*Personalized Message:* ${order.personalizedMessage ? `"${order.personalizedMessage}"` : 'None'}

*Items:*
${itemsText}`;

      const whatsappUrl = `https://wa.me/7907549067?text=${encodeURIComponent(messageText)}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Navigate to order details
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!giftBox) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <form onSubmit={handlePay} className="mt-8 space-y-6">
        <div className="card space-y-2 text-sm">
          <h3 className="mb-2 border-b border-brand-900/10 pb-2 text-base font-semibold dark:border-brand-400/15">Order Items</h3>
          {giftBox.items?.map((item) => (
            <div key={item.product?._id || item._id} className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">{item.product?.name}</span>
              <span className="text-gray-500 font-medium dark:text-gray-400">Qty: {item.quantity}</span>
            </div>
          ))}
        </div>
        <button type="submit" disabled={processing} className="btn-primary w-full py-3 text-lg">
          {processing ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </form>
    </div>
  );
}
