import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import the cors package

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  credentials: true, // Allow credentials
}));

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const router = express.Router();
app.use('/api', router);


router.get('/', (req, res) => {
  res.send('Hello World');
});

router.use('/images', imageRoutes);

router.use('/auth', authRoutes);