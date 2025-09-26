import React, { useState, useEffect, useRef } from "react";
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaUser, 
  FaEllipsisH,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaExpand,
  FaCompress
} from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! I'm your ASTRA assistant. I can help you with:\n• Module information\n• Data insights\n• Technical support\n• Project guidance\n\nHow can I assist you today?",
      timestamp: new Date(),
      quickReplies: ["Tell me about modules", "Show dashboard", "Technical help", "Contact support"]
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const botResponses = {
    greeting: "Hello! I'm here to help you navigate the ASTRA platform. What would you like to know?",
    modules: "ASTRA has 5 main modules:\n\n🔹 **Pulse** - Real-time monitoring\n🔹 **Atlas** - Interactive mapping\n🔹 **Simulate** - Scenario testing\n🔹 **Impact** - Analytics & metrics\n🔹 **Engage** - Collaboration tools\n\nWhich module interests you?",
    dashboard: "The dashboard provides live metrics on:\n• Heat exposure impacts\n• Water stress indicators\n• Economic cost analysis\n• Environmental monitoring\n\nWould you like to see specific data?",
    support: "For technical support:\n• Email: support@astra.com\n• Phone: +1-555-ASTRA-HELP\n• Live chat: Available 24/7\n\nWhat specific issue are you facing?",
    default: "I understand you're interested in that. Let me connect you with the right resources. Our team can provide detailed assistance with this topic."
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage = { 
      sender: "user", 
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      let response = botResponses.default;
      
      if (input.toLowerCase().includes('module') || input.toLowerCase().includes('pulse') || input.toLowerCase().includes('atlas')) {
        response = botResponses.modules;
      } else if (input.toLowerCase().includes('dashboard') || input.toLowerCase().includes('data')) {
        response = botResponses.dashboard;
      } else if (input.toLowerCase().includes('help') || input.toLowerCase().includes('support')) {
        response = botResponses.support;
      } else if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
        response = botResponses.greeting;
      }

      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: response,
          timestamp: new Date(),
          quickReplies: ["More about modules", "Dashboard access", "Technical issues", "Contact human agent"]
        }
      ]);
      setIsTyping(false);
      setShowRating(true);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  const handleRating = (stars) => {
    setRating(stars);
    setTimeout(() => setShowRating(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-2xl ring-4 ring-blue-200/50 flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce"
          >
            <FaRobot className="text-2xl" />
          </button>
          <span className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg">
            🤖 Ask ASTRA Assistant
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
          </span>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-lg">ASTRA Assistant</h2>
                <p className="text-blue-100 text-xs">Online • Always here to help</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isMinimized ? <FaExpand className="text-sm" /> : <FaCompress className="text-sm" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          {/* Messages Area - Hidden when minimized */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 space-y-4 max-h-[300px] overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end space-x-2`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.sender === "bot" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                      }`}>
                        {msg.sender === "bot" ? <FaRobot /> : <FaUser />}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`rounded-2xl p-3 shadow-sm ${
                        msg.sender === "bot" 
                          ? "bg-white border border-gray-200 text-gray-800 rounded-bl-none" 
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
                        <div className={`text-xs mt-1 ${
                          msg.sender === "bot" ? "text-gray-500" : "text-blue-100"
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Replies */}
                {messages[messages.length - 1]?.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {messages[messages.length - 1].quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaRobot className="text-blue-600 text-sm" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3">
                      <FaEllipsisH className="text-gray-400 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Rating System */}
                {showRating && !isTyping && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-yellow-800 font-medium mb-2">Was this response helpful?</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-yellow-300'} hover:scale-110 transition-transform`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-700">
                          <FaThumbsUp />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <FaThumbsDown />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isTyping}
                    className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  ASTRA Assistant • Powered by AI • Always learning
                </p>
              </div>
            </>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaRobot className="text-blue-600 text-xl" />
                <span className="font-medium text-gray-700">ASTRA Assistant</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <button
                onClick={() => setIsMinimized(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FaExpand />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;