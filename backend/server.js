import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import the cors package

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigin = 'https://main.d21o76va97lham.amplifyapp.com'; // Replace with your actual domain

app.use(cors({
  origin: allowedOrigin,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  allowedHeaders: 'X-Requested-With, content-type, Authorization',
  credentials: true, // Allow credentials
}));

// Handle preflight OPTIONS requests manually
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials like cookies
  return res.sendStatus(200); // Respond with 200 OK for OPTIONS preflight requests
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

const router = express.Router();
app.use('/api', router);

router.use('/auth', authRoutes);
router.use('/images', imageRoutes);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
