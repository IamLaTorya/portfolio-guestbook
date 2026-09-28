// 1. Load environment variables from your .env file
import 'dotenv/config';
import express from 'express';
// 2. Import Express framework
const app = express();

// 3. Define your port (defaulting to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;

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
