const { chatService } = require('../services/chat');

const handleChat = async (req, res) => {
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
};

module.exports = { handleChat }; 