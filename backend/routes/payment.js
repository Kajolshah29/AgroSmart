const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();
const router = express.Router();

// Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order API
router.post('/create-order', async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
        payment_capture: 1,
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// ✅ VERIFY PAYMENT API - THIS PART
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sellerAddress } = req.body;

    // Generate Signature
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment is verified
        res.json({ success: true, message: 'Payment verified successfully.' });
        
        // 🚀 Later here: Call blockchain function to record transaction
    } else {
        // Payment is not verified
        res.status(400).json({ error: 'Invalid signature, payment failed!' });
    }
});

module.exports = router;
