import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import {
  getStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  getAllProductsAdmin,
} from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/products', getAllProductsAdmin);

export default router;
