import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulate bot response (you can replace with real API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message! We'll get back to you soon." },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[320px] max-w-full bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden animate-scale-in flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">🤖 Chat with Us</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-xl"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-2 text-sm text-gray-700 max-h-[250px] overflow-y-auto flex-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.sender === "bot"
                    ? "bg-gray-100 text-left"
                    : "bg-indigo-100 text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input + Send */}
          <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;