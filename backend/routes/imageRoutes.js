import { Router } from 'express';
import { processImage, saveImage, getImages } from '../controllers/imageController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Protect the route with JWT authentication
router.post('/upload', authenticateToken, upload.single('image'), processImage);
router.post('/save', authenticateToken, upload.single('image'), saveImage);
router.get('/getImages/:userId', authenticateToken, getImages);

export default router;
