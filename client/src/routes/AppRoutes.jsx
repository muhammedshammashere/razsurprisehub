import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import Landing from '../pages/Landing';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import GiftBox from '../pages/GiftBox';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminLogin from '../pages/admin/AdminLogin';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

function AdminDashboardWrapper() {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (user && user.role === 'admin') {
    return <Dashboard />;
  }
  return <AdminLogin />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />
        <Route path="login" element={<Navigate to="/" replace />} />
        <Route path="register" element={<Navigate to="/" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route path="gift-box" element={<GiftBox />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
        </Route>
        <Route path="admin" element={<AdminDashboardWrapper />} />
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>
    </Routes>
  );
}
