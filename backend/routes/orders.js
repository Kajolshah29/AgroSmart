const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentDetails } = req.body;
    const buyerId = req.user.id;

    // Create order
    const order = new Order({
      buyerId,
      items,
      totalAmount,
      paymentMethod,
      paymentDetails,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing'
    });

    await order.save();

    // Handle payment based on method
    if (paymentMethod === 'cod') {
      // For COD, just mark as pending
      order.paymentStatus = 'pending';
    } else if (paymentMethod === 'upi') {
      // For UPI, mark as processing
      order.paymentStatus = 'processing';
      // Here you would typically integrate with a UPI payment gateway
    } else if (paymentMethod === 'card') {
      // For card payments, validate and process
      if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.cvv) {
        return res.status(400).json({ message: 'Invalid card details' });
      }
      // Here you would typically integrate with a payment gateway
      order.paymentStatus = 'processing';
    }

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get buyer's orders
router.get('/buyer', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get farmer's orders
router.get('/farmer', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.farmerId': req.user.id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify if user is authorized to update this order
    if (order.buyerId.toString() !== req.user.id && 
        !order.items.some(item => item.farmerId.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Update payment status
router.patch('/:orderId/payment', auth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only buyer can update payment status
    if (order.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status' });
  }
});

module.exports = router; 