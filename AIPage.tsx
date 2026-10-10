import { useState } from 'react';
import { Bot, Send, Sparkles, Info } from 'lucide-react';
import type { AIResponse } from '@/types';

interface AIMessage {
  role: 'user' | 'ai';
  text: string;
  suggestions?: string[];
}

// Simulated AI responses — clearly demo, not connected to a real AI service
function generateResponse(question: string): AIResponse {
  const q = question.toLowerCase();

  if (q.includes('price') || q.includes('pricing') || q.includes('cost')) {
    return {
      question,
      answer:
        'Based on current demo market data, tomatoes are averaging ₹35 per kg, bell peppers around ₹60, and leafy greens like spinach about ₹30. I recommend pricing slightly below average if your produce is urgent — a 10–15% discount can attract buyers faster.',
      suggestions: [
        'What crops are in high demand?',
        'How should I price perishable goods?',
        'What is the best time to list produce?',
      ],
      timestamp: new Date().toISOString(),
    };
  }

  if (q.includes('demand') || q.includes('popular') || q.includes('high')) {
    return {
      question,
      answer:
        'Currently, the most searched-for crops in the demo marketplace are tomatoes, strawberries, and sweet corn. Leafy greens see steady demand from restaurants. If you grow these, listing promptly after harvest maximises your chances of a quick sale.',
      suggestions: [
        'Which crops spoil fastest?',
        'How do I reduce food waste?',
        'What buyers are looking for root vegetables?',
      ],
      timestamp: new Date().toISOString(),
    };
  }

  if (q.includes('waste') || q.includes('spoil') || q.includes('perish')) {
    return {
      question,
      answer:
        'To reduce spoilage: (1) Mark highly perishable items like spinach, strawberries, and tomatoes as urgent. (2) List within 24 hours of harvest. (3) Consider bulk discounts for large quantities. (4) Connect with local food banks for unsold surplus — it reduces waste and supports the community.',
      suggestions: [
        'How should I price perishable goods?',
        'What crops are in high demand?',
        'How do I contact buyers quickly?',
      ],
      timestamp: new Date().toISOString(),
    };
  }

  if (q.includes('buyer') || q.includes('contact') || q.includes('sell')) {
    return {
      question,
      answer:
        'To sell faster: make sure your listing has a clear photo, accurate location, and competitive pricing. Buyers often filter by region, so a precise location helps. You can also share your listing link directly with local restaurants and grocers.',
      suggestions: [
        'What crops are in high demand?',
        'How should I price perishable goods?',
        'How do I reduce food waste?',
      ],
      timestamp: new Date().toISOString(),
    };
  }

  return {
    question,
    answer:
      'I can help with pricing suggestions, crop demand trends, reducing food waste, and tips for connecting with buyers. Try asking about any of these topics, or pick one of the suggested questions below.',
    suggestions: [
      'What crops are in high demand?',
      'How should I price my produce?',
      'How do I reduce food waste?',
    ],
    timestamp: new Date().toISOString(),
  };
}

export default function AIPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'ai',
      text: 'Hello! I am the FarmRescue AI assistant. I can help you with pricing, crop demand, and waste reduction tips. What would you like to know?',
      suggestions: [
        'What crops are in high demand?',
        'How should I price my produce?',
        'How do I reduce food waste?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: response.answer, suggestions: response.suggestions },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
          <Bot className="w-7 h-7 text-green-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">AI Assistant</h1>
        <p className="text-gray-500">
          Get smart suggestions for pricing, demand, and reducing food waste.
        </p>
      </div>

      {/* Demo notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          <strong>Demo notice:</strong> The AI responses on this page are simulated
          for the hackathon. They are not generated by a real AI service and use
          pre-written answers based on keywords in your question.
        </p>
      </div>

      {/* Chat window */}
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col" style={{ height: '70vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-green-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold">FarmRescue AI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>

                {msg.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.suggestions.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => handleSend(s)}
                        className="bg-white border border-green-300 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5 text-green-600 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold">FarmRescue AI</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pricing, demand, waste reduction..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
