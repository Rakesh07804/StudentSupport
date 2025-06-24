const mongoose = require('mongoose');
require('dotenv').config();

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student_support');
        console.log('✅ Connected to MongoDB');

        // Get all collection names
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);

        console.log('📋 Found collections:', collectionNames);

        // Drop all collections
        for (const collectionName of collectionNames) {
            await mongoose.connection.db.dropCollection(collectionName);
            console.log(`🗑️  Dropped collection: ${collectionName}`);
        }

        console.log('✅ All data cleared successfully!');
        console.log('📊 Database is now empty and ready for fresh data.');

    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the script
clearDatabase(); 