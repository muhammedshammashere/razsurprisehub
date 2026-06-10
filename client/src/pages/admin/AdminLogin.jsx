import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin role required.');
      }
      toast.success('Access granted. Welcome back, Admin!');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card border border-slate-100 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage products, orders, and users.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter email"
              className="input-field mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                className="input-field pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3l18 18M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7a12.3 12.3 0 01-2.1 3.1M6.6 6.6A12.5 12.5 0 002 12c1 2.5 5 7 10 7a9.9 9.9 0 004.1-.9"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9a3 3 0 110 6 3 3 0 010-6z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full py-3 text-base shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
