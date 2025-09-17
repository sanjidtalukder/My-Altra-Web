import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Atlas from './Atlas';
import Scene3D from './Scene3D';

const NetworkVisualization: React.FC = () => {
  const [view3D, setView3D] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          onClick={() => setView3D(!view3D)}
          className="btn btn-sm btn-primary"
        >
          {view3D ? '2D Atlas' : '3D Holographic'}
        </motion.button>
      </div>

      {view3D ? (
        <div className="w-full h-full relative">
          <Scene3D />
        </div>
      ) : (
        <Atlas />
      )}
    </div>
  );
};

export default NetworkVisualization;