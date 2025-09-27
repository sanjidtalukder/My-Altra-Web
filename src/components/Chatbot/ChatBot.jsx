import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaExpand, FaCompress, FaStar } from 'react-icons/fa';

// Knowledge Base - Comprehensive Q&A database
const knowledgeBase = {
  // NASA Data Explanations
  "modis": "MODIS is like a giant thermometer in space orbiting on NASA's Aqua and Terra satellites. It measures Land Surface Temperature, showing us exactly where our cities are overheating. This helps us identify urban heat islands that need cooling solutions.",
  
  "lst": "Land Surface Temperature (LST) tells us how hot the ground feels to the touch. It's different from air temperature - a black asphalt parking lot can be 20°C hotter than the air above it! We use MODIS data to track these surface hotspots.",
  
  "imerg": "IMERG is NASA's global precipitation radar from space. It combines data from multiple satellites to create a complete picture of rainfall every 30 minutes, helping us predict flood risks before they become emergencies.",
  
  "aod": "Aerosol Optical Depth (AOD) is our pollution lens. It measures how much sunlight is blocked by particles in the air - giving us a clear view of air quality across your entire city, even between ground sensors.",
  
  "ndvi": "NDVI is the green health score for your city. By measuring the difference between visible and infrared light, it shows us exactly how healthy and abundant your vegetation is - from park trees to rooftop gardens.",
  
  "viirs": "VIIRS gives us a night-time X-ray of city activity. Its nighttime lights data reveals patterns of energy use, economic activity, and areas that need better access to electricity and services.",

  // ASTRA Platform Features
  "pulse": "Pulse is the city's heartbeat monitor. It gives you a real-time wellbeing score and shows active risks in your neighborhood. Think of it as the mission control dashboard for urban health. Ready to check your city's vital signs?",
  
  "datalab": "DataLab is your digital twin laboratory. Here you can layer NASA data, predict future risks, and compare different time periods. It's where we turn raw satellite data into actionable insights. Launch into DataLab to see the big picture.",
  
  "simulate": "Simulate is your urban planning crystal ball. Test 'what if' scenarios - add green spaces, improve drainage, expand recycling - and see the projected outcomes before committing resources. Perfect for testing tomorrow's solutions today.",
  
  "engage": "Engage is the community conversation hub. This is where citizen reports meet planner proposals, creating a transparent dialogue about your city's future. This is where space data meets street action.",
  
  "atlas": "Atlas is your city's environmental biography. Scroll through years of NASA data and see how your urban landscape has evolved. Understand past patterns to make better decisions for the future.",
  
  "impact": "Impact is our victory dashboard. See before-and-after comparisons, track percentage improvements, and celebrate the lives improved through data-driven action. This is where we prove change is possible.",

  // General Platform
  "what is astra": "ASTRA is the bridge between NASA's orbital perspective and your city's street-level needs. We transform satellite data into actionable insights for planners, citizens, and communities working toward urban resilience. Think of us as mission control for planetary-scale problem solving.",
  
  "how does it work": "ASTRA works in three steps: First, we ingest real-time data from NASA satellites. Second, we process it into understandable maps and metrics. Third, we provide tools for simulation, engagement, and impact tracking - creating a complete loop from data to action.",
  
  "who is it for": "ASTRA serves three key groups: City Planners get data-driven decision tools, Citizens get actionable insights about their neighborhoods, and Community Leaders get engagement platforms for collaborative problem-solving.",

  // Fallback responses
  "default": "I'm not sure about that specific question. Try asking about NASA data like MODIS or IMERG, or ASTRA features like Pulse or DataLab. You can also click one of the quick questions below!",
  
  "greeting": "Hello! I'm ASTRA Mission Control. I can explain NASA satellite data, walk you through platform features, or help you understand urban analytics. What would you like to know?",
};

// Input Handler - Intelligent question processing
const processInput = (input) => {
  const cleanInput = input.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  
  // Check for exact matches
  if (knowledgeBase[cleanInput]) {
    return {
      answer: knowledgeBase[cleanInput],
      confidence: 'high',
      suggestedActions: getSuggestedActions(cleanInput)
    };
  }
  
  // Check for keyword matches
  const keywords = cleanInput.split(' ');
  for (const keyword of keywords) {
    if (knowledgeBase[keyword] && keyword.length > 2) {
      return {
        answer: knowledgeBase[keyword],
        confidence: 'medium',
        suggestedActions: getSuggestedActions(keyword)
      };
    }
  }
  
  // Check for partial matches and related terms
  const relatedMatch = findRelatedMatch(cleanInput);
  if (relatedMatch) {
    return {
      answer: knowledgeBase[relatedMatch],
      confidence: 'low',
      suggestedActions: getSuggestedActions(relatedMatch)
    };
  }
  
  // Greeting detection
  if (cleanInput.includes('hello') || cleanInput.includes('hi') || cleanInput.includes('hey')) {
    return {
      answer: knowledgeBase.greeting,
      confidence: 'high',
      suggestedActions: []
    };
  }
  
  // Default fallback
  return {
    answer: knowledgeBase.default,
    confidence: 'none',
    suggestedActions: []
  };
};

const findRelatedMatch = (input) => {
  const relatedTerms = {
    'temperature': 'lst',
    'heat': 'modis',
    'rain': 'imerg',
    'precipitation': 'imerg',
    'pollution': 'aod',
    'air quality': 'aod',
    'vegetation': 'ndvi',
    'green': 'ndvi',
    'lights': 'viirs',
    'night': 'viirs',
    'dashboard': 'pulse',
    'real-time': 'pulse',
    'lab': 'datalab',
    'analysis': 'datalab',
    'scenario': 'simulate',
    'planning': 'simulate',
    'community': 'engage',
    'citizen': 'engage',
    'map': 'atlas',
    'history': 'atlas',
    'results': 'impact',
    'improvement': 'impact'
  };
  
  for (const [term, match] of Object.entries(relatedTerms)) {
    if (input.includes(term)) {
      return match;
    }
  }
  
  return null;
};

const getSuggestedActions = (topic) => {
  const actions = {
    'modis': ['Show Heat Map', 'View Urban Heat Islands'],
    'lst': ['Open Temperature Dashboard', 'Compare Surface Temperatures'],
    'imerg': ['Check Rainfall Data', 'View Flood Risk Areas'],
    'aod': ['Open Air Quality Map', 'Check Pollution Levels'],
    'ndvi': ['View Vegetation Health', 'Analyze Green Spaces'],
    'viirs': ['See Nighttime Activity', 'Check Energy Consumption'],
    'pulse': ['Open Pulse Dashboard', 'Check City Vital Signs'],
    'datalab': ['Launch DataLab', 'Explore Data Layers'],
    'simulate': ['Start Simulation', 'Test Scenarios'],
    'engage': ['Open Community Hub', 'Join Discussion'],
    'atlas': ['Explore Historical Data', 'View Timeline'],
    'impact': ['See Results Dashboard', 'Track Progress']
  };
  
  return actions[topic] || [];
};

// MessageBubble Component
const MessageBubble = ({ message, isUser }) => {
  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600'
        }`}>
          {isUser ? (
            <span className="text-white text-sm">👤</span>
          ) : (
            <span className="text-white text-sm">🚀</span>
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`rounded-2xl p-3 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' 
            : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-bl-none border border-cyan-500/20'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {formatMessage(message.text)}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-cyan-300'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

// QuickQuestionGrid Component
const QuickQuestionGrid = ({ onQuestionClick }) => {
  const questionCategories = [
    {
      title: "🌍 NASA Data",
      color: "from-green-500 to-cyan-500",
      questions: [
        { text: "What is MODIS?", key: "modis" },
        { text: "Explain LST", key: "lst" },
        { text: "How does IMERG work?", key: "imerg" },
        { text: "What is AOD?", key: "aod" },
        { text: "Tell me about NDVI", key: "ndvi" },
        { text: "What is VIIRS?", key: "viirs" }
      ]
    },
    {
      title: "🚀 ASTRA Features",
      color: "from-purple-500 to-pink-500",
      questions: [
        { text: "What is Pulse?", key: "pulse" },
        { text: "Explain DataLab", key: "datalab" },
        { text: "How does Simulate work?", key: "simulate" },
        { text: "What is Engage?", key: "engage" },
        { text: "Tell me about Atlas", key: "atlas" },
        { text: "What is Impact?", key: "impact" }
      ]
    }
  ];

  return (
    <div className="space-y-3">
      {questionCategories.map((category, index) => (
        <div key={index} className="space-y-1">
          <h3 className={`text-xs font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            {category.title}
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {category.questions.map((question, qIndex) => (
              <button
                key={qIndex}
                onClick={() => onQuestionClick(question.key)}
                className="text-left p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {question.text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main AskAstra Component
const ChatBot = ({ onActionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm ASTRA Mission Control. I can explain NASA satellite data, walk you through platform features, or help you understand urban analytics. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Process and get response
    setTimeout(() => {
      const response = processInput(inputValue);
      
      const botMessage = {
        text: response.answer,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setSuggestedActions(response.suggestedActions);
      setIsThinking(false);
      setShowRating(true);
    }, 1000 + Math.random() * 500);
  };

  const handleQuickQuestion = (questionKey) => {
    setInputValue(questionKey);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    }
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
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl ring-4 ring-cyan-200/50 flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce"
          >
            <FaRobot className="text-2xl" />
          </button>
          <span className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg">
            🚀 Ask ASTRA Mission Control
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
          </span>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-gradient-to-br from-gray-900 to-black shadow-2xl rounded-2xl border border-cyan-500/30 overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          
          {/* Header - minimized  */}
          {!isMinimized && (
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-3 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaRobot className="text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-md">ASTRA Mission Control</h2>
                  <p className="text-cyan-100 text-xs">Online • NASA Data Expert</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FaCompress className="text-xs" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FaTimes className="text-md" />
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          {!isMinimized ? (
            <div className="flex flex-col h-full">
              {/* Main content area */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Messages container with scroll */}
                <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: '320px' }}>
                  {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} isUser={message.isUser} />
                  ))}
                  
                  {/* Thinking Indicator */}
                  {isThinking && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                        <FaRobot className="text-cyan-600 text-xs" />
                      </div>
                      <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl rounded-bl-none p-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {suggestedActions.length > 0 && !isThinking && (
                    <div className="mt-3 space-y-1">
                      <p className="text-cyan-300 text-xs font-medium">QUICK ACTIONS:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleActionClick(action)}
                            className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-full transition-all duration-200 hover:scale-105"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating System */}
                  {showRating && !isThinking && messages.length > 2 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-3">
                      <p className="text-xs text-yellow-800 font-medium mb-1">Was this response helpful?</p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(star)}
                              className={`text-md ${star <= rating ? 'text-yellow-500' : 'text-yellow-300'} hover:scale-110 transition-transform`}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions Grid - Only show when there are few messages */}
                {messages.length <= 1 && !isThinking && (
                  <div className="border-t border-cyan-500/20 p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    <QuickQuestionGrid onQuestionClick={handleQuickQuestion} />
                  </div>
                )}
              </div>

              {/* Input Area - Fixed at bottom */}
           <div className="border-t border-cyan-500/20 p-3 bg-gray-900/50 sticky bottom-0 z-40">
  <div className="flex space-x-2">
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Ask about NASA data or ASTRA features..."
      className="flex-1 px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm text-white placeholder-gray-400"
      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
    />
    <button
      onClick={handleSendMessage}
      disabled={isThinking}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2 rounded-full hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex-shrink-0"
    >
      <FaPaperPlane className="text-xs" />
    </button>
  </div>
  <p className="text-xs text-cyan-400 text-center mt-1">
    ASTRA Mission Control • Powered by NASA Data
  </p>
</div>
            </div>
          ) : (
            /* Minimized State */
            <div className="p-3 flex items-center justify-between bg-gradient-to-r from-cyan-600 to-blue-700  sticky">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-white text-lg" />
                <span className="font-medium text-white text-sm">ASTRA Mission Control</span>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <FaExpand className="text-xs" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <FaTimes className="text-md" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;