import React, { useState, useEffect } from 'react';

interface SimpleMapProps {
  activeMetric: string;
  timelineIndex: number;
  compareMode: boolean;
  onFeatureClick: (feature: any) => void;
}

const SimpleMap: React.FC<SimpleMapProps> = ({
  activeMetric,
  timelineIndex,
  compareMode,
  onFeatureClick
}) => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState("");

  // Generate visualization data based on active metric
  const getVisualizationData = () => {
    const baseIntensity = 0.5 + (timelineIndex * 0.2);
    
    switch (activeMetric) {
      case 'temperature':
        return {
          color: 'from-yellow-400 to-red-600',
          pattern: 'Heat zones detected',
          intensity: Math.min(100, 60 + timelineIndex * 8),
          icon: '🌡️'
        };
      case 'floodRisk':
        return {
          color: 'from-blue-400 to-blue-800',
          pattern: 'Flood risk areas',
          intensity: Math.min(100, 25 + timelineIndex * 12),
          icon: '💧'
        };
      case 'airQuality':
        return {
          color: 'from-green-400 to-orange-600',
          pattern: 'Air quality zones',
          intensity: Math.min(100, 75 + timelineIndex * 5),
          icon: '🌫️'
        };
      case 'energy':
        return {
          color: 'from-emerald-400 to-purple-600',
          pattern: 'Energy consumption',
          intensity: Math.min(100, 85 - timelineIndex * 3),
          icon: '⚡'
        };
      default:
        return {
          color: 'from-primary to-accent',
          pattern: 'Data visualization',
          intensity: 50,
          icon: '📊'
        };
    }
  };

  const handleFeatureHover = (e: React.MouseEvent, feature: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 60
    });
    setTooltipContent(`${feature.properties.name}: ${feature.properties.value}`);
    setShowTooltip(true);
  };

  const handleFeatureLeave = () => {
    setShowTooltip(false);
  };

  const handleFeatureClick = (feature: any) => {
    setSelectedFeature(feature);
    onFeatureClick(feature);
    
    // Auto-deselect after 3 seconds
    setTimeout(() => {
      setSelectedFeature(null);
    }, 3000);
  };

  const vizData = getVisualizationData();

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
      {/* Animated grid background for cyber effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Data visualization overlay with animation */}
      <div className={`absolute inset-0 bg-gradient-to-br ${vizData.color} opacity-30 mix-blend-overlay animate-pulse-slow`} />
      
      {/* Pulsing data points with improved styling */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 rounded-full cursor-pointer transition-all duration-300 ${
              selectedFeature && selectedFeature.properties.name === `${vizData.pattern} Zone ${i + 1}`
                ? 'ring-4 ring-cyan-400 scale-150'
                : 'ring-2 ring-cyan-400/50 hover:scale-150'
            }`}
            style={{
              left: `${15 + (i * 11)}%`,
              top: `${25 + (i % 4) * 18}%`,
              background: `radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, rgba(0, 255, 255, 0.2) 70%, transparent 100%)`,
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
              animation: `pulse 2s infinite ${i * 0.3}s`
            }}
            onMouseEnter={(e) => handleFeatureHover(e, {
              properties: {
                name: `${vizData.pattern} Zone ${i + 1}`,
                metric: activeMetric,
                value: vizData.intensity + (i * 5)
              }
            })}
            onMouseLeave={handleFeatureLeave}
            onClick={() => handleFeatureClick({
              properties: {
                name: `${vizData.pattern} Zone ${i + 1}`,
                metric: activeMetric,
                value: vizData.intensity + (i * 5)
              }
            })}
          />
        ))}
      </div>

      {/* Flowing data streams with improved animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-data-flow"
            style={{
              width: '300px',
              top: `${20 + i * 15}%`,
              left: `${i % 2 === 0 ? '-100px' : 'calc(100% - 200px)'}`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '15s',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* 3D building representations with improved styling */}
      <div className="absolute bottom-20 left-10 space-x-2 flex items-end">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`rounded-t-sm transition-all duration-1000 cursor-pointer hover:brightness-125 ${
              selectedFeature && selectedFeature.properties.name === `Building ${i + 1}`
                ? 'ring-2 ring-cyan-400 scale-110'
                : ''
            }`}
            style={{
              width: '14px',
              height: `${30 + i * 12 + timelineIndex * 5}px`,
              background: `linear-gradient(to top, ${vizData.color.replace('from-', '').replace('to-', '').replace(' ', ', ')})`,
              opacity: 0.8,
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
            }}
            onMouseEnter={(e) => handleFeatureHover(e, {
              properties: {
                name: `Building ${i + 1}`,
                metric: activeMetric,
                value: 850 + (i * 50) + (timelineIndex * 20)
              }
            })}
            onMouseLeave={handleFeatureLeave}
            onClick={() => handleFeatureClick({
              properties: {
                name: `Building ${i + 1}`,
                metric: activeMetric,
                value: 850 + (i * 50) + (timelineIndex * 20)
              }
            })}
          />
        ))}
      </div>

      {/* Map overlay information with improved styling */}
      <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 shadow-lg">
        <div className="text-sm space-y-2">
          <div className="font-bold text-cyan-400 flex items-center gap-2">
            <span className="text-lg">{vizData.icon}</span>
            {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Visualization
          </div>
          <div className="text-xs text-gray-300 flex items-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
            Timeline: {timelineIndex === 0 ? 'Current' : `+${timelineIndex * 7} days`}
          </div>
          <div className="text-xs text-cyan-300">
            Intensity: {vizData.intensity}%
          </div>
          {compareMode && (
            <div className="text-xs text-green-400 flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              Compare Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Legend with improved styling */}
      <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 shadow-lg">
        <div className="text-xs space-y-2">
          <div className="font-bold text-cyan-400 mb-1">Legend</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 bg-gradient-to-r ${vizData.color} rounded-sm shadow-md`}></div>
              <span className="text-gray-300">{vizData.pattern}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500/80 shadow-md" style={{animation: 'pulse 2s infinite'}}></div>
              <span className="text-gray-300">Data Points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-6 bg-gradient-to-t ${vizData.color.split(' ')[0]} ${vizData.color.split(' ')[1]} rounded-t-sm shadow-md`}></div>
              <span className="text-gray-300">Buildings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scanning effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-scan"
          style={{top: `${(Date.now() / 20) % 100}%`}}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="absolute bg-gray-900/90 backdrop-blur-sm text-cyan-300 text-xs py-2 px-3 rounded-md border border-cyan-500/50 shadow-lg z-10 transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltipContent}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-cyan-500/50"></div>
        </div>
      )}

      {/* Custom styles for animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.7; transform: scale(1); }
          }
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
          }
          @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
          }
          .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .animate-data-flow {
            animation: dataFlow 10s linear infinite;
          }
          @keyframes dataFlow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(calc(100vw + 100px)); }
          }
        `}
      </style>
    </div>
  );
};

export default SimpleMap;