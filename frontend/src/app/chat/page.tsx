'use client';

import { useState } from 'react';
import { ChatMessage } from '../types/chat';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { farmer: input, ai: '' };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const aiMessage: ChatMessage = { farmer: input, ai: data.response };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Gemini Chatbot</h1>
      <div className="border rounded-lg h-[400px] p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <p className="font-semibold text-blue-600">You: <span className="font-normal">{msg.farmer}</span></p>
            <p className="font-semibold text-green-600">Gemini: <span className="font-normal">{msg.ai}</span></p>
          </div>
        ))}
        {loading && <p className="text-gray-400">Gemini is typing...</p>}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
