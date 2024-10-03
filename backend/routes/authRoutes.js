import { Router } from 'express';
import { authenticateUser, addUser } from '../controllers/authController.js';

const router = Router();

router.post('/login', authenticateUser);
router.post('/signup', addUser);


export default router;
