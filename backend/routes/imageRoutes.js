import { Router } from 'express';
import { processImage, saveImage, getImages } from '../controllers/imageController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit files to 5 MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File type not supported!'));
  }
});

// Protect the route with JWT authentication
router.post('/upload', authenticateToken, upload.single('image'), processImage);
router.post('/save', authenticateToken, upload.single('image'), saveImage);
router.get('/getImages/:userId', authenticateToken, getImages);

export default router;
