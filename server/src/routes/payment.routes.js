import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createRazorpayOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = Router();

router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
