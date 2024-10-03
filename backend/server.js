import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import the cors package

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:5173']; // Add your allowed origins here

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
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
