import express from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/chat', authenticateToken, chatController.handleChat);

export default router; 