import React from 'react';

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
  // Generate visualization data based on active metric
  const getVisualizationData = () => {
    const baseIntensity = 0.5 + (timelineIndex * 0.2);
    
    switch (activeMetric) {
      case 'temperature':
        return {
          color: 'from-yellow-400 to-red-600',
          pattern: 'Heat zones detected',
          intensity: Math.min(100, 60 + timelineIndex * 8)
        };
      case 'floodRisk':
        return {
          color: 'from-blue-400 to-blue-800',
          pattern: 'Flood risk areas',
          intensity: Math.min(100, 25 + timelineIndex * 12)
        };
      case 'airQuality':
        return {
          color: 'from-green-400 to-orange-600',
          pattern: 'Air quality zones',
          intensity: Math.min(100, 75 + timelineIndex * 5)
        };
      case 'energy':
        return {
          color: 'from-emerald-400 to-purple-600',
          pattern: 'Energy consumption',
          intensity: Math.min(100, 85 - timelineIndex * 3)
        };
      default:
        return {
          color: 'from-primary to-accent',
          pattern: 'Data visualization',
          intensity: 50
        };
    }
  };

  const vizData = getVisualizationData();

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Grid background for cyber effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Data visualization overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${vizData.color} opacity-30 mix-blend-overlay`} />
      
      {/* Pulsing data points */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded-full bg-primary/60 animate-pulse cursor-pointer hover:scale-150 transition-transform duration-300`}
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`
            }}
            onClick={() => onFeatureClick({
              properties: {
                name: `${vizData.pattern} Zone ${i + 1}`,
                metric: activeMetric,
                value: vizData.intensity + (i * 5)
              }
            })}
          />
        ))}
      </div>

      {/* Flowing data streams */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow"
            style={{
              width: '200px',
              top: `${25 + i * 25}%`,
              animationDelay: `${i * 1}s`
            }}
          />
        ))}
      </div>

      {/* 3D building representations */}
      <div className="absolute bottom-20 left-10 space-x-2 flex items-end">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`bg-gradient-to-t ${vizData.color} rounded-t-sm transition-all duration-1000 cursor-pointer hover:brightness-125`}
            style={{
              width: '12px',
              height: `${40 + i * 15 + timelineIndex * 5}px`,
              opacity: 0.7
            }}
            onClick={() => onFeatureClick({
              properties: {
                name: `Building ${i + 1}`,
                metric: activeMetric,
                value: 850 + (i * 50) + (timelineIndex * 20)
              }
            })}
          />
        ))}
      </div>

      {/* Map overlay information */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
        <div className="text-sm space-y-1">
          <div className="font-medium text-primary">
            {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} View
          </div>
          <div className="text-xs text-muted-foreground">
            Timeline: {timelineIndex === 0 ? 'Current' : `+${timelineIndex * 7} days`}
          </div>
          <div className="text-xs text-accent">
            Intensity: {vizData.intensity}%
          </div>
          {compareMode && (
            <div className="text-xs text-primary">
              Compare Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
        <div className="text-xs space-y-2">
          <div className="font-medium">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 bg-gradient-to-r ${vizData.color} rounded`}></div>
              <span>{vizData.pattern}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span>Data Points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-6 bg-gradient-to-t ${vizData.color} rounded-t`}></div>
              <span>Buildings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scanning effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse"
        />
      </div>

    </div>
  );
};

export default SimpleMap;