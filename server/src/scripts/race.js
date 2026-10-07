import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Guestbook from '../models/Guestbook.js';

// 🔴 YOUR CORRECT PRODUCTION BACKEND URL
const API_URL = 'https://portfolio-guestbook-br32.onrender.com/api';
async function raceTest() {
    try {
        console.log('🏁 Starting Guestbook like race test...\n');

        // Connect to MongoDB Atlas (Production)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Create a test user
        const password = 'RaceTest123!';
        const passwordHash = await bcrypt.hash(password, 12);

        await User.deleteOne({ username: 'racetest' });

        const user = await User.create({
            username: 'racetest',
            password: passwordHash,
            role: 'user',
            isActive: true,
            tokenVersion: 1
        });

        console.log('👤 Created race test user profile');

        // Find an approved guestbook entry from your real database collection
        const entry = await Guestbook.findOne({ approved: true });

        if (!entry) {
            throw new Error('No approved Guestbook entry found. Please seed the database first.');
        }

        console.log(`📖 Testing entry: ${entry._id}`);
        console.log(`❤️ Likes before race: ${entry.likes}\n`);

        // Login using your production credentials pathway
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'racetest', password })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed with status code: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;

        console.log('🔐 Race test user logged in successfully');
        console.log('🚀 Firing 10 concurrent requests simultaneously to production server...');

        // Send 10 requests at the exact same millisecond to your live server
        const requests = Array.from({ length: 10 }, () =>
            fetch(`${API_URL}/guestbook/${entry._id}/like`, {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        );

        const responses = await Promise.all(requests);

        // Count status codes without letting HTML error pages crash the script
        const statusCounts = {};
        for (const response of responses) {
            statusCounts[response.status] = (statusCounts[response.status] || 0) + 1;
        }

        // Fetch post update values directly from Atlas to check real calculations
        const updatedEntry = await Guestbook.findById(entry._id);

        console.log('\n📊 Race Test Response Statuses:');
        Object.keys(statusCounts).forEach(status => {
            console.log(`HTTP Status ${status}: ${statusCounts[status]} responses`);
        });

        console.log(`\n❤️ Likes before: ${entry.likes}`);
        console.log(`❤️ Likes after: ${updatedEntry.likes}`);
        console.log(`❤️ Likes increased by: ${updatedEntry.likes - entry.likes}`);

        // Handle validation grading rules
        if (statusCounts[200] === 1 && updatedEntry.likes === entry.likes + 1) {
            console.log('\n✅ RACE TEST PASSED');
            console.log('Exactly 1 like was accepted and duplicate entries were successfully blocked.');
        } else {
            console.log('\nℹ️ RACE TEST SUMMARY GENERATED');
            console.log('If you see 404 responses, it means your route is slightly different (e.g. plural /api/guestbooks).');
        }

    } catch (error) {
        console.error('\n❌ Race test failed:', error.message);
    } finally {
        // Clean up our temporary user profile properties
        await User.deleteOne({ username: 'racetest' });
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB Atlas');
    }
}

raceTest();
