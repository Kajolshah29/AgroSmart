const express = require('express');
const { handleChat } = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', auth, handleChat);

module.exports = router; 