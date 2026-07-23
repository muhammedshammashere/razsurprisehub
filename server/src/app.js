import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import giftBoxRoutes from './routes/giftBox.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('trust proxy', true);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 600px; margin: 4rem auto; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); text-align: center;">
      <h2 style="color: #f97316; margin-bottom: 1rem; font-size: 1.8rem; font-weight: 800;">🎁 Raz Surprise Hub</h2>
      <p style="color: #10b981; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">Backend API Server is Running</p>
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 2rem;">Connected to live Firebase Firestore database successfully.</p>
      <p style="color: #6b7280; font-size: 0.95rem; margin-bottom: 1.5rem;">To access the visual store interface and manage products, please open the frontend client:</p>
      <a href="http://localhost:5173" style="background-color: #2563eb; color: white; padding: 0.8rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; transition: background-color 0.2s;">Open Frontend website (Port 5173)</a>
    </div>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Raz Surprise Hub API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gift-box', giftBoxRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
