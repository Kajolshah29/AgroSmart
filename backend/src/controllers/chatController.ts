import { Request, Response } from 'express';
import { chatService } from '../services/chatService';

export const chatController = {
  async handleChat(req: Request, res: Response) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await chatService.getResponse(message);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat controller:', error);
      res.status(500).json({ error: 'Failed to process chat request' });
    }
  }
}; 