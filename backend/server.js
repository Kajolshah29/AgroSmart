const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);


// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to AgroSmart API' });
});

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
}); 