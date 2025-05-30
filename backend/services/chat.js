const { HfInference } = require('@huggingface/inference');

require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Farming-specific system prompt
const SYSTEM_PROMPT = `You are an AI assistant specialized in helping farmers. You provide accurate, practical advice about:
- Crop management and selection
- Soil health and preparation
- Pest control and prevention
- Weather impact on farming
- Sustainable farming practices
- Equipment and technology
- Market trends and pricing
- Government policies and subsidies

Always provide practical, actionable advice based on best practices. If you're unsure about something, acknowledge the limitations of your knowledge. Keep your answers short and precise, directly addressing the user's query without unnecessary details.`;

const chatService = {
  async getResponse(message) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ];

      const response = await hf.chatCompletion({
        model: 'google/gemma-2b-it',
        messages: messages,
        parameters: {
          max_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1,
        }
      });

      return response.choices[0]?.message?.content || 'No response from AI.';
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to get AI response');
    }
  }
};

module.exports = { chatService }; 