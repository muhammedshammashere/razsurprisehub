import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.middleware.js';
import { createReview, deleteReview, getReviews } from '../controllers/review.controller.js';

const router = Router();

router.get('/', getReviews);
router.post('/', createReview);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
