const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');

// Register Farmer
router.post('/register/farmer', async (req, res) => {
    try {
        const { name, email, password, phone, address, farmDetails } = req.body;
        
        // Check if farmer already exists
        const existingFarmer = await Farmer.findOne({ email });
        if (existingFarmer) {
            return res.status(400).json({ 
                success: false,
                message: 'Farmer with this email already exists' 
            });
        }

        // Create new farmer
        const farmer = new Farmer({
            name,
            email,
            password,
            phone,
            address,
            farmDetails
        });

        await farmer.save();

        // Generate token
        const token = jwt.sign(
            { 
                userId: farmer._id,
                role: 'farmer'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Farmer registered successfully!',
            token,
            user: {
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                role: 'farmer'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering farmer', 
            error: error.message
        });
    }
});

// Register Buyer
router.post('/register/buyer', async (req, res) => {
    try {
        const { name, email, password, phone, address, businessDetails } = req.body;
        
        // Check if buyer already exists
        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({ 
                success: false,
                message: 'Buyer with this email already exists' 
            });
        }

        // Create new buyer
        const buyer = new Buyer({
            name,
            email,
            password,
            phone,
            address,
            businessDetails
        });

        await buyer.save();

        // Generate token
        const token = jwt.sign(
            { 
                userId: buyer._id,
                role: 'buyer'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Buyer registered successfully!',
            token,
            user: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                role: 'buyer'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering buyer', 
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('Login attempt:', { email, role }); // Log login attempt

        let user;
        let userRole;

        // Check in appropriate collection based on role
        if (role === 'farmer') {
            user = await Farmer.findOne({ email });
            userRole = 'farmer';
        } else if (role === 'buyer') {
            user = await Buyer.findOne({ email });
            userRole = 'buyer';
        }

        console.log('User found:', user ? 'Yes' : 'No'); // Log if user was found

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch); // Log password match result

        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                userId: user._id,
                role: userRole
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} login successful!`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: userRole
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Log any errors
        res.status(500).json({ 
            success: false,
            message: 'Error logging in', 
            error: error.message 
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const { userId, role } = decoded;

        let user;
        if (role === 'farmer') {
            user = await Farmer.findById(userId).select('-password');
        } else if (role === 'buyer') {
            user = await Buyer.findById(userId).select('-password');
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Explicitly include role-specific details
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt,
            role,
            ...(role === 'farmer' 
                ? { farmDetails: user.farmDetails } 
                : { businessDetails: user.businessDetails })
        };

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user', 
            error: error.message 
        });
    }
});

// Update Profile
router.put('/update-profile', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const { userId, role } = decoded;

        let user;
        if (role === 'farmer') {
            user = await Farmer.findById(userId);
        } else if (role === 'buyer') {
            user = await Buyer.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Update basic fields
        const { name, email, phone, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        // Update role-specific fields
        if (role === 'farmer' && req.body.farmDetails) {
            user.farmDetails = {
                ...user.farmDetails,
                ...req.body.farmDetails
            };
        } else if (role === 'buyer' && req.body.businessDetails) {
            user.businessDetails = {
                ...user.businessDetails,
                ...req.body.businessDetails
            };
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role,
                ...(role === 'farmer' 
                    ? { farmDetails: user.farmDetails }
                    : { businessDetails: user.businessDetails }
                )
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating profile', 
            error: error.message 
        });
    }
});

module.exports = router; 