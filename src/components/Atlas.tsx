import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiClock, FiEye, FiGlobe, FiAlertTriangle, FiHome, FiInfo, FiPlay, FiPause, FiZoomIn } from 'react-icons/fi';

// Demo data embedded directly to avoid import issues
const hazardData = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { id: "heat_001", type: "heat", name: "Dhanmondi Heat Island", severity: 0.85, timestamp: "2024-01-15T10:00:00Z" }, geometry: { type: "Point", coordinates: [90.3753, 23.7465] } },
    { type: "Feature", properties: { id: "flood_001", type: "flood", name: "Buriganga Overflow Zone", severity: 0.91, timestamp: "2024-01-10T08:30:00Z" }, geometry: { type: "Point", coordinates: [90.3685, 23.7104] } },
    { type: "Feature", properties: { id: "air_001", type: "air", name: "Tejgaon Industrial Pollution", severity: 0.88, timestamp: "2024-01-14T09:15:00Z" }, geometry: { type: "Point", coordinates: [90.3938, 23.7694] } },
    { type: "Feature", properties: { id: "fire_001", type: "fire", name: "Chawkbazar Fire Risk Zone", severity: 0.79, timestamp: "2024-01-16T16:30:00Z" }, geometry: { type: "Point", coordinates: [90.3958, 23.7167] } }
  ]
};

const communityData = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { id: "community_001", name: "Old Dhaka Ward 12", population: 45000, vulnerabilityIndex: 0.89 }, geometry: { type: "Point", coordinates: [90.3958, 23.7167] } },
    { type: "Feature", properties: { id: "community_002", name: "Korail Slum", population: 200000, vulnerabilityIndex: 0.95 }, geometry: { type: "Point", coordinates: [90.4083, 23.7833] } },
    { type: "Feature", properties: { id: "community_003", name: "Dhanmondi Residential", population: 28000, vulnerabilityIndex: 0.45 }, geometry: { type: "Point", coordinates: [90.3753, 23.7465] } }
  ]
};

interface Node {
  id: string;
  type: 'hazard' | 'community';
  properties: any;
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: Node;
  target: Node;
  weight: number;
  type: string;
}

const Atlas: React.FC = () => {
  const [equityLensActive, setEquityLensActive] = useState(false);
  const [timePeriod, setTimePeriod] = useState('present');
  const [visibleLayers, setVisibleLayers] = useState({
    heat: true,
    flood: true,
    fire: true,
    air: true,
    communities: true,
    connections: true
  });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Animation loop for network visualization
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (equityLensActive) {
        drawNetworkGraph(ctx, canvas);
      } else {
        drawStandardMap(ctx, canvas);
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [equityLensActive, isPlaying, visibleLayers, timePeriod]);

  const drawStandardMap = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Draw background grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw hazard nodes
    hazardData.features.forEach((feature, index) => {
      if (!visibleLayers[feature.properties.type as keyof typeof visibleLayers]) return;
      
      const x = (index + 1) * (width / (hazardData.features.length + 1));
      const y = height * 0.3;
      const radius = feature.properties.severity * 20 + 10;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
      gradient.addColorStop(0, getHazardColor(feature.properties.type, 0.8));
      gradient.addColorStop(1, getHazardColor(feature.properties.type, 0));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Core node
      ctx.fillStyle = getHazardColor(feature.properties.type, 1);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(feature.properties.type.toUpperCase(), x, y + radius + 20);
    });

    // Draw community nodes
    if (visibleLayers.communities) {
      communityData.features.forEach((feature, index) => {
        const x = (index + 1) * (width / (communityData.features.length + 1));
        const y = height * 0.7;
        const radius = Math.min(feature.properties.population / 10000, 15) + 5;
        
        // Vulnerability color
        const vulnColor = getVulnerabilityColor(feature.properties.vulnerabilityIndex);
        
        ctx.fillStyle = vulnColor;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(feature.properties.name.split(' ')[0], x, y + radius + 15);
      });
    }

    // Draw connections
    if (visibleLayers.connections) {
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      
      for (let i = 0; i < Math.min(hazardData.features.length, communityData.features.length); i++) {
        const hazardX = (i + 1) * (width / (hazardData.features.length + 1));
        const hazardY = height * 0.3;
        const communityX = (i + 1) * (width / (communityData.features.length + 1));
        const communityY = height * 0.7;
        
        ctx.beginPath();
        ctx.moveTo(hazardX, hazardY);
        ctx.lineTo(communityX, communityY);
        ctx.stroke();
      }
    }
  };

  const drawNetworkGraph = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const time = Date.now() * 0.001;

    // Dark background
    ctx.fillStyle = 'rgba(10, 10, 18, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // Generate network layout
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add hazard nodes
    hazardData.features.forEach((feature, index) => {
      if (!visibleLayers[feature.properties.type as keyof typeof visibleLayers]) return;
      
      const angle = (index / hazardData.features.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.25;
      const centerX = width / 2;
      const centerY = height / 2;
      
      const node: Node = {
        id: feature.properties.id,
        type: 'hazard',
        properties: feature.properties,
        x: centerX + Math.cos(angle + time * 0.5) * radius,
        y: centerY + Math.sin(angle + time * 0.5) * radius
      };
      nodes.push(node);
    });

    // Add community nodes
    if (visibleLayers.communities) {
      communityData.features.forEach((feature, index) => {
        const angle = (index / communityData.features.length) * Math.PI * 2 + Math.PI;
        const radius = Math.min(width, height) * 0.35;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const node: Node = {
          id: feature.properties.id,
          type: 'community',
          properties: feature.properties,
          x: centerX + Math.cos(angle - time * 0.3) * radius,
          y: centerY + Math.sin(angle - time * 0.3) * radius
        };
        nodes.push(node);
      });
    }

    // Generate links
    const hazardNodes = nodes.filter(n => n.type === 'hazard');
    const communityNodes = nodes.filter(n => n.type === 'community');

    hazardNodes.forEach(hazard => {
      communityNodes.forEach(community => {
        const distance = Math.sqrt(
          Math.pow(hazard.x - community.x, 2) + 
          Math.pow(hazard.y - community.y, 2)
        );
        
        if (distance < 200) {
          links.push({
            source: hazard,
            target: community,
            weight: (300 - distance) / 300,
            type: hazard.properties.type
          });
        }
      });
    });

    // Draw links
    if (visibleLayers.connections) {
      links.forEach(link => {
        const opacity = 0.3 + link.weight * 0.7;
        ctx.strokeStyle = getHazardColor(link.type, opacity);
        ctx.lineWidth = link.weight * 4;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
        
        // Animated particles along the link
        const t = (time * simulationSpeed) % 1;
        const particleX = link.source.x + (link.target.x - link.source.x) * t;
        const particleY = link.source.y + (link.target.y - link.source.y) * t;
        
        ctx.fillStyle = getHazardColor(link.type, 1);
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw nodes
    nodes.forEach(node => {
      const radius = node.type === 'hazard' ? 
        (node.properties.severity * 15 + 10) : 
        (Math.min(node.properties.population / 15000, 12) + 8);
      
      const color = node.type === 'hazard' ? 
        getHazardColor(node.properties.type, 1) : 
        getVulnerabilityColor(node.properties.vulnerabilityIndex);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Core node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Orbitron';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(
        node.properties.name || node.properties.type, 
        node.x, 
        node.y + radius + 15
      );
      ctx.shadowBlur = 0;
    });
  };

  const getHazardColor = (type: string, alpha: number = 1): string => {
    switch (type) {
      case 'heat': return `rgba(255, 92, 51, ${alpha})`;
      case 'flood': return `rgba(51, 133, 255, ${alpha})`;
      case 'fire': return `rgba(255, 51, 51, ${alpha})`;
      case 'air': return `rgba(204, 204, 204, ${alpha})`;
      default: return `rgba(153, 153, 153, ${alpha})`;
    }
  };

  const getVulnerabilityColor = (index: number): string => {
    const r = Math.floor(255 * index);
    const g = Math.floor(255 * (1 - index));
    return `rgb(${r}, ${g}, 0)`;
  };

  const toggleLayer = (layerName: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-full bg-base-100">
      
      {/* Canvas Container */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ background: 'linear-gradient(145deg, hsl(224 71% 4%), hsl(240 38% 6%))' }}
      />
      
      {/* UI Controls */}
<div className="absolute top-4 right-4 z-20 flex flex-col gap-4">
  {/* Equity Lens Toggle */}
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`rounded-full shadow-lg px-5 py-2 flex items-center gap-2 transition-all duration-300 ${
      equityLensActive 
        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 hover:bg-indigo-700' 
        : 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20'
    }`}
    onClick={() => setEquityLensActive(!equityLensActive)}
  >
    <FiEye className="mr-1" />
    {equityLensActive ? 'Map View' : 'Equity Lens'}
  </motion.button>

  {/* Time Travel Slider */}
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className="rounded-2xl p-4 w-64 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
  >
    <div className="flex items-center mb-2 text-indigo-300">
      <FiClock className="mr-2" />
      <span className="font-bold">Time Travel</span>
    </div>
    <div className="flex justify-between text-xs mb-2 text-white/70">
      <span>Past</span>
      <span>Present</span>
      <span>Future</span>
    </div>
    <input
      type="range"
      min="0"
      max="2"
      value={['past', 'present', 'future'].indexOf(timePeriod)}
      onChange={(e) => setTimePeriod(['past', 'present', 'future'][parseInt(e.target.value)])}
      className="w-full h-2 bg-indigo-500/30 rounded-lg appearance-none cursor-pointer accent-indigo-500"
    />
  </motion.div>

  {/* Layer Controls */}
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="rounded-2xl p-4 w-64 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
  >
    <div className="flex items-center mb-2 text-indigo-300">
      <FiLayers className="mr-2" />
      <span className="font-bold">Layers</span>
    </div>
    <div className="flex flex-col gap-2 text-white/90">
      <label className="cursor-pointer flex items-center hover:text-indigo-200 transition">
        <input
          type="checkbox"
          checked={visibleLayers.heat}
          onChange={() => toggleLayer('heat')}
          className="mr-2 accent-indigo-400"
        />
        <FiAlertTriangle className="text-orange-400 mr-1" />
        <span className="text-sm">Heat Hazards</span>
      </label>
      <label className="cursor-pointer flex items-center hover:text-indigo-200 transition">
        <input
          type="checkbox"
          checked={visibleLayers.flood}
          onChange={() => toggleLayer('flood')}
          className="mr-2 accent-indigo-400"
        />
        <FiAlertTriangle className="text-blue-400 mr-1" />
        <span className="text-sm">Flood Hazards</span>
      </label>
      <label className="cursor-pointer flex items-center hover:text-indigo-200 transition">
        <input
          type="checkbox"
          checked={visibleLayers.fire}
          onChange={() => toggleLayer('fire')}
          className="mr-2 accent-indigo-400"
        />
        <FiAlertTriangle className="text-red-400 mr-1" />
        <span className="text-sm">Fire Hazards</span>
      </label>
      <label className="cursor-pointer flex items-center hover:text-indigo-200 transition">
        <input
          type="checkbox"
          checked={visibleLayers.air}
          onChange={() => toggleLayer('air')}
          className="mr-2 accent-indigo-400"
        />
        <FiAlertTriangle className="text-gray-400 mr-1" />
        <span className="text-sm">Air Hazards</span>
      </label>
      <label className="cursor-pointer flex items-center hover:text-indigo-200 transition">
        <input
          type="checkbox"
          checked={visibleLayers.communities}
          onChange={() => toggleLayer('communities')}
          className="mr-2 accent-indigo-400"
        />
        <FiHome className="text-green-400 mr-1" />
        <span className="text-sm">Communities</span>
      </label>
      <label className="cursor-pointer flex items-center hover:text-indigo-200 transition">
        <input
          type="checkbox"
          checked={visibleLayers.connections}
          onChange={() => toggleLayer('connections')}
          className="mr-2 accent-indigo-400"
        />
        <FiGlobe className="text-purple-400 mr-1" />
        <span className="text-sm">Connections</span>
      </label>
    </div>
  </motion.div>

  {/* Simulation Controls */}
  {equityLensActive && (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl p-4 w-64 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
    >
      <div className="flex items-center mb-2 text-indigo-300">
        <FiPlay className="mr-2" />
        <span className="font-bold">Simulation</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <button 
          className={`px-3 py-1 rounded-lg flex items-center gap-2 transition ${
            isPlaying 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          onClick={togglePlayPause}
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="flex gap-2">
          {[0.5, 1, 2].map(speed => (
            <button
              key={speed}
              className={`px-2 py-1 rounded-md transition ${
                simulationSpeed === speed
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              onClick={() => setSimulationSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )}
</div>

      
     {/* Legend */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="absolute bottom-4 left-4 z-[1000] rounded-2xl p-5 w-60 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
>
  <div className="flex items-center mb-3 text-indigo-300">
    <FiGlobe className="mr-2" />
    <span className="font-bold tracking-wide">Legend</span>
  </div>

  <div className="space-y-3 text-white/90">
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-orange-500 shadow-md shadow-orange-500/60 mr-2"></div>
      <span className="text-sm">Heat Hazard</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md shadow-blue-500/60 mr-2"></div>
      <span className="text-sm">Flood Hazard</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-red-500 shadow-md shadow-red-500/60 mr-2"></div>
      <span className="text-sm">Fire Hazard</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-gray-400 shadow-md shadow-gray-400/50 mr-2"></div>
      <span className="text-sm">Air Hazard</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-red-500 shadow-md shadow-green-500/40 mr-2"></div>
      <span className="text-sm">Community Vulnerability</span>
    </div>
  </div>
</motion.div>


      {/* Info Panel */}
      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 z-[1000] command-panel rounded-lg p-4 w-80"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-primary">
              {selectedNode.type === 'hazard' ? 'Hazard Details' : 'Community Details'}
            </h3>
            <button 
              onClick={() => setSelectedNode(null)} 
              className="text-lg text-muted-foreground hover:text-primary"
            >
              ×
            </button>
          </div>
          {selectedNode.type === 'hazard' ? (
            <>
              <p className="text-sm"><strong>Type:</strong> {selectedNode.properties.type}</p>
              <p className="text-sm"><strong>Severity:</strong> {Math.round(selectedNode.properties.severity * 100)}%</p>
              <p className="text-sm"><strong>Name:</strong> {selectedNode.properties.name}</p>
            </>
          ) : (
            <>
              <p className="text-sm"><strong>Name:</strong> {selectedNode.properties.name}</p>
              <p className="text-sm"><strong>Population:</strong> {selectedNode.properties.population.toLocaleString()}</p>
              <p className="text-sm"><strong>Vulnerability:</strong> {Math.round(selectedNode.properties.vulnerabilityIndex * 100)}%</p>
            </>
          )}
        </motion.div>
      )}

      {/* Tutorial Overlay */}
{showTutorial && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 z-20 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm flex items-center justify-center"
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-8 w-96 max-w-[90vw] bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl"
    >
      <h2 className="text-2xl font-bold mb-5 text-center text-indigo-300 tracking-wide drop-shadow-lg">
        Welcome to Atlas
      </h2>
      <div className="space-y-3 mb-6 text-white/90">
        <p className="text-sm">This interactive visualization shows environmental hazards and their impact on vulnerable communities.</p>
        <p className="text-sm">• Use the <strong className="text-indigo-300">Equity Lens</strong> to see network connections</p>
        <p className="text-sm">• Toggle different <strong className="text-indigo-300">layers</strong> to focus on specific data</p>
        <p className="text-sm">• Use the <strong className="text-indigo-300">time slider</strong> to explore scenarios</p>
        <p className="text-sm">• Click elements for detailed information</p>
      </div>
      <button 
        className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md transition"
        onClick={() => setShowTutorial(false)}
      >
        Get Started
      </button>
    </motion.div>
  </motion.div>
)}


      {/* Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 right-4 z-[1000] btn command-panel rounded-full w-12 h-12 flex items-center justify-center"
        onClick={() => setShowTutorial(true)}
      >
        <FiInfo className="text-xl" />
      </motion.button>

      {/* Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-[1000] bg-base-200/70 text-primary text-xs p-2 flex justify-between backdrop-blur-sm"
      >
        <div>
          {equityLensActive ? 'Equity Lens Active' : 'Standard Map View'} | 
          {timePeriod === 'past' ? ' Viewing Past Data' : 
          timePeriod === 'present' ? ' Viewing Current Data' : ' Viewing Future Projections'}
        </div>
        <div>
          {hazardData.features.length} Hazards | {communityData.features.length} Communities | Connected
        </div>
      </motion.div>
    </div>
  );
};

export default Atlas;