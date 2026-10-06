import { Router } from 'express';
import { initiateTransfer, getUserTransfers, updateTransferStatus } from '../controllers/transferController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/', initiateTransfer);
router.get('/', getUserTransfers);
router.patch('/:id/status', updateTransferStatus);

export default router;
