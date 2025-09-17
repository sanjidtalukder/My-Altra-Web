import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Shield, Activity, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-primary/20 bg-base-100/80 backdrop-blur-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Satellite className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 w-8 h-8 text-primary animate-ping opacity-20">
                <Satellite className="w-full h-full" />
              </div>
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-primary font-['Orbitron'] holo-text">
                ATLAS
              </h1>
              <p className="text-xs text-muted-foreground">
                ASTRA Command Environmental Diagnostic Engine
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-6">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Activity className="w-5 h-5 text-success" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs">
                <div className="text-success font-medium">CONNECTED</div>
                <div className="text-muted-foreground">Data Stream Active</div>
              </div>
            </div>

            {/* Security Level */}
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-warning" />
              <div className="text-xs">
                <div className="text-warning font-medium">LEVEL 3</div>
                <div className="text-muted-foreground">Security Clearance</div>
              </div>
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-primary" />
            </motion.button>
          </div>
        </div>

        {/* Mission Status Bar */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary">Mission: Urban Risk Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Target: Metropolitan Area</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span className="text-muted-foreground">Satellites: 12 Active</span>
            </div>
          </div>
          
          <div className="text-muted-foreground">
            Stardate: {new Date().toISOString().split('T')[0]} | Time: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;