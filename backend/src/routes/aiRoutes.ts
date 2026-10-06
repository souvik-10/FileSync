import { Router } from 'express';
import { summarizeFile, getFileInsights, queryFile, getFileAnalysisHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/summarize', summarizeFile);
router.post('/insights', getFileInsights);
router.post('/query', queryFile);
router.get('/history/:fileId', getFileAnalysisHistory);

export default router;
