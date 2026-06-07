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
        <p className="mt-8 text-gray-500">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:border-brand-300"
            >
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
