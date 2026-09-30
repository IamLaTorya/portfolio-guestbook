import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// Import required models
import User from './models/User.js';
import Guestbook from './models/Guestbook.js';
import Counter from './models/Counter.js';

//Create a sample guestbook entry
const sampleEntry = {
    displayName: 'Sample User',
    message: 'Welcome to my guestbook!',
    approved: true,
    likes: 0,
    likedby: []
};

async function seed() {
    // connect to MongoDb
    try {
        console.log('🔄 Connected to MongoDB for seeding the database');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        // Safety Net
        if (process.env.NODE_ENV === 'production') {
            console.error('Refusing to seed a production database.');
            process.exit(1);
        }

        // Clear existing data
        await User.deleteMany({});
        await Guestbook.deleteMany({});
        await Counter.deleteMany({});
        console.log('🗑️ Cleared existing data from MongoDB');

        // Reset Guestbook ID tracking counter
        await Counter.create({ _id: 'guestbook_id', seq: 1 });
        console.log('🔢 Reset ID tracking counter for guestbook');

        // Check for the Admin user credentials
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in the environment variables');
            process.exit(1);
        }

        // Hash the admin password before creating the user
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

        // Create the Admin user
        const admin = await User.create({
            username: process.env.ADMIN_USERNAME,
            password: passwordHash,
            role: 'admin',
            isActive: true,
            tokenVersion: 1,
        });
        console.log(`👤 Created Admin user: ${admin.username}`);

        // Create the sample guestbook entry
        const createEntry = await Guestbook.create({
            _id: 'GB-0001',
            author: admin._id,
            ...sampleEntry
        });
        console.log(`📝 Created sample guestbook entry: ${createEntry._id}`);
        
        console.log('✅ Database seeding completed successfully');

    } catch (error) {
        console.error('❌ Database seed failed:', error.message);
        process.exitcode = 1;
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();