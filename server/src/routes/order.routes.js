import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

export default router;
