import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Home/Navbar";
import Chatbot from "../components/Chatbot/ChatBot";


const RootLayout = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
};

export default RootLayout;