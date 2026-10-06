import { Router } from 'express';
import { uploadFile, getUserFiles, getFileById, downloadFile, deleteFile } from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(protect);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getUserFiles);
router.get('/:id', getFileById);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteFile);

export default router;
