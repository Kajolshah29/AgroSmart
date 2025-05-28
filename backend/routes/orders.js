const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Get all orders for a farmer
router.get('/farmer', auth, async (req, res) => {
    try {
        const orders = await Order.find({ farmer: req.user.userId })
            .populate('buyer', 'name email')
            .populate('product', 'name price images')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// Get all orders for a buyer
router.get('/buyer', auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.userId })
            .populate('farmer', 'name email')
            .populate('product', 'name price images')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// Create a new order (buyer request)
router.post('/', auth, async (req, res) => {
    try {
        const { productId, quantity, deliveryAddress } = req.body;

        const order = new Order({
            product: productId,
            buyer: req.user.userId,
            quantity,
            deliveryAddress,
            status: 'pending'
        });

        await order.save();

        // Populate the order with product and buyer details
        await order.populate('product', 'name price images farmer');
        await order.populate('buyer', 'name email');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// Update order status (farmer accepting/rejecting orders)
router.put('/:orderId/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify that the user is the farmer who owns the product
        if (order.product.farmer.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
});

module.exports = router; 