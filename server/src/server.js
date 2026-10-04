// 1. Load environment variables from your .env file
import 'dotenv/config';
// 2. Import Express framework
import express from 'express';
// 8. Import Mongoose for MongoDB connection
import mongoose from 'mongoose';
// 15. Import security-related middleware
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// 11. Import the authentication routes
import authRoutes from './routes/auth.js';
// 13. Import the guestbook routes
import guestbookRoutes from './routes/guestbook.js';

// 2a. Initialize Express application
const app = express();
// 16. Apply security-related middleware
// 16a. Apply security-related middleware
app.use(helmet());
// 16b. Apply CORS middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
    credentials: true
}));

// 4. Built-in Middleware to parse JSON incoming payloads
app.use(express.json());

// 16c. Apply MongoDB data sanitization middleware
app.use(mongoSanitize());

// 16d. Apply rate limiting to the API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later.'
});
//17. Apply rate limiting to the API
app.use('/api',apiLimiter);

// 3. Define your port (defaulting to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;
// 9. Connect to MongoDB using Mongoose
const MONGODB_URI = process.env.MONGODB_URI;
// 10. Attempt to connect to MongoDB and handle errors, this runs before the server starts listening
try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection established successfully!');
} catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit the process with an error code
}

// 12. Use the authentication routes
app.use('/api/auth', authRoutes);
// 14. Use the guestbook routes
app.use('/api/guestbook', guestbookRoutes);
// 5. Create a basic test route
app.get('/', (req, res) => {
    res.send('The Portfolio Guestbook server is running!');
});
// 6. Create a health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 7. Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`🚀 Server is listening perfectly on port ${PORT}`);
});
