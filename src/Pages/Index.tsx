import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import NetworkVisualization from '../components/NetworkVisualization';
import ControlPanel from '../components/ControlPanel';
import DataPanel from '../components/DataPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-base-100 text-primary">
      {/* Header */}
      <Header />

      {/* Main Dashboard */}
      <main className="p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-3"
          >
            <ControlPanel />
          </motion.div>

          {/* Main Visualization Area */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-6"
          >
            <div className="command-panel rounded-lg p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary font-['Orbitron'] holo-text">
                  NETWORK VISUALIZATION
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs text-success">Real-time Analysis</span>
                </div>
              </div>
              
              <NetworkVisualization />
            </div>
          </motion.div>

          {/* Right Sidebar - Data */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="col-span-3"
          >
            <DataPanel />
          </motion.div>
        </div>
      </main>

      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 bg-grid"
        style={{ zIndex: -1 }}
      />
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Index;