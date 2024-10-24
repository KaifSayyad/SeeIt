import { Router } from 'express';
import { authenticateUser, addUser } from '../controllers/authController.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World from /auth');
});
router.post('/login', authenticateUser);
router.post('/signup', addUser);


export default router;
