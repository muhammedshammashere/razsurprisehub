import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/ui/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/AuthContext';
import { getReviews } from '../../utils/reviews';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [reviewCount, setReviewCount] = useState(() => getReviews().length);
  const { logout } = useAuth();

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setData(data));
  }, []);

  useEffect(() => {
    const syncReviewCount = () => setReviewCount(getReviews().length);

    window.addEventListener('storage', syncReviewCount);
    window.addEventListener('sv:reviews-updated', syncReviewCount);
    return () => {
      window.removeEventListener('storage', syncReviewCount);
      window.removeEventListener('sv:reviews-updated', syncReviewCount);
    };
  }, []);

  if (!data) return <Loader />;

  const { stats, recentOrders } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Users', value: stats.totalUsers },
          { label: 'Products', value: stats.totalProducts },
          { label: 'Orders', value: stats.totalOrders },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4 items-center">
        <Link to="/admin/products?action=add" className="btn-primary flex items-center gap-1.5">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
        <Link to="/admin/products" className="btn-secondary flex items-center gap-1.5">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Product
        </Link>
        <Link to="/admin/orders" className="btn-secondary">
          Manage Orders
        </Link>
        <Link to="/admin/users" className="btn-secondary">
          Manage Users
        </Link>
        <Link to="/admin/reviews" className="btn-secondary">
          Reviews ({reviewCount})
        </Link>
        <button
          onClick={logout}
          className="rounded-lg border border-red-200 bg-red-50/50 px-5 py-2.5 font-medium text-red-700 transition-all duration-200 hover:bg-red-50 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 ml-auto"
        >
          Logout
        </button>
      </div>
      <div className="mt-10 card">
        <h2 className="font-semibold">Recent orders</h2>
        <ul className="mt-4 divide-y dark:divide-gray-800">
          {recentOrders.map((o) => (
            <li key={o._id} className="flex justify-between py-3 text-sm">
              <span>
                {o.orderNumber} — {o.user?.name}
              </span>
              <span>{formatCurrency(o.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
