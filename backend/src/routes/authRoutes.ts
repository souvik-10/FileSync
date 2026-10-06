import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, getUsersForSharing } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.get('/users', protect, getUsersForSharing);

export default router;
