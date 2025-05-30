const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, buyerDetails, paymentDetails } = req.body;

    // Get the seller ID from the first product
    const firstProduct = await Product.findById(items[0].productId);
    if (!firstProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({
      items,
      totalAmount,
      buyerDetails,
      sellerId: firstProduct.farmerId,
      paymentDetails,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get all orders for a farmer
router.get('/farmer-requests', auth, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
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

    // Verify that the user is the seller
    if (order.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router; 