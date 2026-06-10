import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
