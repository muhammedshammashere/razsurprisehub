import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (adminOnly && (!user || user.role !== 'admin')) return <Navigate to="/admin" replace />;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}
