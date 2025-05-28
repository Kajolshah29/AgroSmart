const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrosmart';
        
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('MongoDB connected successfully');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit if cannot connect to database
    }
};

module.exports = connectDB; 