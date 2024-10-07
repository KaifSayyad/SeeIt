import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import the cors package

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  allowedHeaders: 'X-Requested-With,content-type',
  credentials: true, // Allow credentials
}));

app.use(cookieParser());
app.use(express.json());

const router = express.Router();
app.use('/api', router);

router.use('/auth', authRoutes);
router.use('/images', imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
