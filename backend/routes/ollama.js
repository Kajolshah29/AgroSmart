const express = require('express');
const router = express.Router();
const axios = require('axios');

const systemPrompt = `
You are KrishiGPT, a helpful agricultural assistant for Indian farmers. 
Give advice on crop selection, weather-based farming, pest control, fertilizers, and irrigation.

- Use simple language with Hindi-English mix.
- If location or crop is missing, ask follow-up questions.
- Respond clearly, like a friend helping a farmer.

User's Question:
`;

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;
  const fullPrompt = systemPrompt + prompt;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral', // or 'llama3'
      prompt: fullPrompt,
      stream: false,
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error('Ollama Error:', error.message);
    res.status(500).json({ error: 'Failed to connect to local AI model.' });
  }
});

module.exports = router;
