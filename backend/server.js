import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

// Add Access-Control-Allow-Origin manually
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with specific origin if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true); // Allow credentials if necessary
    if (req.method === 'OPTIONS') {
        res.sendStatus(200); // Handle preflight request
    } else {
        next();
    }
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
