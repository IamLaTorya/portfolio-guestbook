// 1. Load environment variables from your .env file
import 'dotenv/config';
import express from 'express';
// 8. Import Mongoose for MongoDB connection
import mongoose from 'mongoose';
// 2. Import Express framework
const app = express();
// 3. Define your port (defaulting to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;
// 9. Connect to MongoDB using Mongoose
const MONGO_URI = process.env.MONGO_URI;
// 10. Attempt to connect to MongoDB and handle errors, this runs before the server starts listening
try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connection established successfully!');
} catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit the process with an error code
}
// 4. Built-in Middleware to parse JSON incoming payloads
app.use(express.json());

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
