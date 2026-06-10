import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getGiftBox,
  addItem,
  updateItem,
  removeItem,
  updateGiftBox,
  clearGiftBox,
} from '../controllers/giftBox.controller.js';

const router = Router();

router.use(protect);

router.get('/', getGiftBox);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);
router.patch('/', updateGiftBox);
router.delete('/', clearGiftBox);

export default router;
