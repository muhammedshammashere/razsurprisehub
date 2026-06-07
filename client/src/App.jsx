import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GiftBoxProvider } from './context/GiftBoxContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GiftBoxProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </GiftBoxProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
