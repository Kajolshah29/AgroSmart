const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files will be stored
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        // Use the original file name with a timestamp to avoid conflicts
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to protect routes and ensure user is a farmer
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

            // Check if the user is a farmer
            if (decoded.role !== 'farmer') {
                return res.status(403).json({ message: 'Not authorized as a farmer' });
            }

            // Attach farmer to the request
            req.farmer = await Farmer.findById(decoded.userId).select('-password');

            if (!req.farmer) {
                return res.status(404).json({ message: 'Farmer not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get all products for all users (buyers)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all products that are available
        const products = await Product.find({ status: 'available' }).populate('farmer', 'name farmDetails.farmName'); // Optionally populate farmer name
        res.json(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all products for a farmer
// @route   GET /api/products/farmer
// @access  Private (Farmer)
router.get('/farmer', protect, async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.farmer._id });
        res.json(products);
    } catch (error) {
        console.error('Error fetching farmer products:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a new product
// @route   POST /api/products/farmer
// @access  Private (Farmer)
router.post('/farmer', protect, upload.array('images', 5), async (req, res) => {
    try {
        // req.body will contain the text fields
        // req.files will contain the uploaded image file(s)
        const { name, description, price, quantity, category, location, harvestDate, isOrganic, status } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];

        const product = new Product({
            name,
            description,
            price,
            quantity,
            category,
            farmer: req.farmer._id, // Associate product with the logged-in farmer
            images,
            location,
            harvestDate,
            isOrganic: isOrganic === 'true', // Convert string boolean to boolean
            status
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a product
// @route   PUT /api/products/farmer/:id
// @access  Private (Farmer)
router.put('/farmer/:id', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, quantity, category, location, harvestDate, isOrganic, status } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];

        const product = await Product.findOne({ _id: req.params.id, farmer: req.farmer._id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or not owned by farmer' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;
        product.category = category || product.category;
        product.location = location || product.location;
        product.harvestDate = harvestDate || product.harvestDate;
        product.isOrganic = isOrganic !== undefined ? isOrganic === 'true' : product.isOrganic; // Handle boolean conversion
        if (images.length > 0) {
            product.images = images; // Update images only if new ones are uploaded
        }
        product.status = status || product.status;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/farmer/:id
// @access  Private (Farmer)
router.delete('/farmer/:id', protect, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, farmer: req.farmer._id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or not owned by farmer' });
        }

        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; 