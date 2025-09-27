// src/components/civic-engagement/DialogueOrchestrator/DialogueOrchestrator.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  User, 
  Satellite, 
  Building,
  ThumbsUp,
  ThumbsDown,
  Bot
} from 'lucide-react';

const DialogueOrchestrator = ({ activeProposal, socket, liveUpdates }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'nasa',
      user: 'Orbital Intelligence',
      content: 'MODIS data shows this area has a persistent 5°C heat anomaly compared to adjacent neighborhoods.',
      timestamp: new Date(Date.now() - 3600000),
      data: { temperature: '+5°C', confidence: '95%' }
    },
    {
      id: 2,
      type: 'citizen',
      user: 'Maria Rodriguez',
      content: 'I walk through here every day and it\'s unbearable in summer. More trees would make a huge difference!',
      timestamp: new Date(Date.now() - 1800000),
      verified: true
    },
    {
      id: 3,
      type: 'planner',
      user: 'City Planning Dept',
      content: 'We propose 150 native trees along this corridor. Estimated temperature reduction: 1.8°C based on our models.',
      timestamp: new Date(Date.now() - 900000),
      official: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      type: 'citizen',
      user: 'You',
      content: newMessage,
      timestamp: new Date(),
      verified: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Auto NASA response simulation
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        type: 'nasa',
        user: 'Orbital Intelligence',
        content: 'Landsat NDVI analysis confirms this area has 40% less canopy cover than city average. Your suggestion aligns with optimal intervention zones.',
        timestamp: new Date(),
        data: { canopyCover: '-40%', optimalZone: 'Yes' }
      }]);
    }, 2000);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => setIsRecording(false), 3000);
  };

  const getAvatar = (type) => {
    switch (type) {
      case 'nasa': return <Satellite className="w-4 h-4 text-blue-600" />;
      case 'planner': return <Building className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-purple-600" />;
    }
  };

  const getBubbleStyle = (type) => {
    switch (type) {
      case 'nasa': return 'bg-blue-50 border-blue-200';
      case 'planner': return 'bg-green-50 border-green-200';
      default: return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 text-purple-500 mr-2" />
          Three-Way Dialogue
        </h2>
        <p className="text-sm text-gray-600">Citizens • Planners • NASA Data</p>
      </div>

      {/* Democracy Pulse */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-purple-800">Democracy Pulse</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-green-600 flex items-center">
              <ThumbsUp className="w-3 h-3 mr-1" /> 72%
            </span>
            <span className="text-xs text-red-600 flex items-center">
              <ThumbsDown className="w-3 h-3 mr-1" /> 28%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: '72%' }}
          ></div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border ${getBubbleStyle(message.type)}`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-full ${
                    message.type === 'nasa' ? 'bg-blue-100' :
                    message.type === 'planner' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {getAvatar(message.type)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{message.user}</span>
                  {message.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">✓ Verified</span>
                  )}
                  {message.official && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">Official</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Content */}
              <p className="text-sm text-gray-800 mb-2">{message.content}</p>

              {/* NASA Data Evidence */}
              {message.data && (
                <div className="bg-white/50 rounded p-2 border border-blue-200">
                  <div className="flex items-center text-xs text-blue-700 mb-1">
                    <Bot className="w-3 h-3 mr-1" />
                    Data Evidence
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(message.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts or record a voice note..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows="1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={startRecording}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Voice Recording Indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording... 0:03</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DialogueOrchestrator;
