import { useState, useEffect } from 'react';
import { X, Send, Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { ChatMessage } from '../app/types/chat';

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatPopup = ({ isOpen, onClose }: AIChatPopupProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Reset messages when chat is opened
    if (isOpen) {
      setMessages([]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Get farmer name from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFarmerName(user.name || 'Farmer');
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { farmer: input, ai: '' };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ollama/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const aiMessage: ChatMessage = { farmer: input, ai: data.response };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
    } catch (err) {
      console.error('Error:', err);
      const errorMessage: ChatMessage = { farmer: input, ai: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">🤖</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">AI Farming Assistant</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-green-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p className="text-center">
                Ask me anything about farming, crops, or agricultural practices! 🌱
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="animate-fadeIn">
                {msg.farmer && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-600 mb-1">{farmerName}</p>
                      <p className="text-gray-700 bg-blue-50 rounded-lg p-3">{msg.farmer}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3 mt-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">🤖</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-600 mb-1">AI Assistant</p>
                    <p className="text-gray-700 bg-green-50 rounded-lg p-3">{msg.ai}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animation-delay-400"></div>
              <span className="ml-2">AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about farming, crops, or agricultural practices..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
            <Button
              onClick={toggleRecording}
              className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 rounded-lg`}
              title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg flex items-center gap-2"
              disabled={loading}
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPopup; 