import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Filter, Eye, Clock, Map } from 'lucide-react';

interface ControlPanelProps {
  onEquityLensToggle?: (active: boolean) => void;
  onTimeUpdate?: (time: number) => void;
  onFilterChange?: (filters: string[]) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onEquityLensToggle,
  onTimeUpdate,
  onFilterChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeValue, setTimeValue] = useState(75);
  const [equityLens, setEquityLens] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['heat', 'flood', 'pollution']);

  const hazardTypes = [
    { id: 'heat', name: 'Heat Islands', color: 'text-error', count: 12 },
    { id: 'flood', name: 'Flood Zones', color: 'text-info', count: 8 },
    { id: 'pollution', name: 'Air Quality', color: 'text-base-content', count: 15 },
    { id: 'fire', name: 'Fire Risk', color: 'text-warning', count: 3 }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, this would control the time animation
  };

  const handleEquityToggle = () => {
    const newState = !equityLens;
    setEquityLens(newState);
    onEquityLensToggle?.(newState);
  };

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTimeChange = (value: number) => {
    setTimeValue(value);
    onTimeUpdate?.(value);
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="command-panel rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary font-['Orbitron']">ATLAS CONTROL</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success">ACTIVE</span>
          </div>
        </div>

        {/* Time Travel Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Time Travel</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(2020 + (timeValue / 100) * 4, 0).getFullYear()}
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={timeValue}
              onChange={(e) => handleTimeChange(Number(e.target.value))}
              className="range range-primary range-sm w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>2020</span>
              <span>2022</span>
              <span>2024</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="btn btn-primary btn-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline btn-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Equity Lens Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary">Equity Lens</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEquityToggle}
              className={`btn btn-sm ${equityLens ? 'btn-accent' : 'btn-outline'}`}
            >
              {equityLens ? 'Network View' : 'Spatial View'}
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {equityLens 
              ? 'Revealing systemic connections between hazards and communities'
              : 'Geographic view showing spatial distribution of risks'
            }
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">View Mode</span>
          </div>
          <div className="btn-group">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="btn btn-sm btn-primary"
            >
              Network
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="btn btn-sm btn-outline"
            >
              Geographic
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="command-panel rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-primary font-['Orbitron']">HAZARD FILTERS</h3>
        </div>

        <div className="space-y-3">
          {hazardTypes.map((hazard) => (
            <motion.div
              key={hazard.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-2 rounded-lg bg-base-200/30 hover:bg-base-200/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={activeFilters.includes(hazard.id)}
                  onChange={() => handleFilterToggle(hazard.id)}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${hazard.color} opacity-75`}></div>
                  <span className="text-sm text-primary">{hazard.name}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-base-300 px-2 py-1 rounded">
                {hazard.count}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-base-300/20">
          <div className="text-xs text-muted-foreground mb-1">Active Pathways</div>
          <div className="text-lg font-bold text-primary">
            {activeFilters.length * 8} / 32
          </div>
          <div className="text-xs text-success">
            {Math.round((activeFilters.length / 4) * 100)}% coverage
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;