import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLayers, FiClock, FiEye, FiGlobe, FiAlertTriangle, FiHome, FiInfo, FiPlay, FiPause, FiX, FiChevronRight, FiChevronDown, FiMap, FiUsers, FiActivity } from 'react-icons/fi';

// Demo data
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

interface VisibleLayers {
  heat: boolean;
  flood: boolean;
  fire: boolean;
  air: boolean;
  communities: boolean;
  connections: boolean;
}

const Atlas: React.FC = () => {
  const [equityLensActive, setEquityLensActive] = useState(false);
  const [timePeriod, setTimePeriod] = useState('present');
  const [visibleLayers, setVisibleLayers] = useState<VisibleLayers>({
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
  const [showLayerControls, setShowLayerControls] = useState(true);
  const [showTimeControls, setShowTimeControls] = useState(true);
  const [showSimulationControls, setShowSimulationControls] = useState(true);
  const [activeTab, setActiveTab] = useState('hazards');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const getFilteredHazards = (): typeof hazardData.features => {
    const now = new Date('2024-01-12T00:00:00Z');
    return hazardData.features.filter((feature) => {
      const timestamp = new Date(feature.properties.timestamp);
      if (timePeriod === 'past') return timestamp < now;
      if (timePeriod === 'present') return (
        timestamp >= new Date('2024-01-12T00:00:00Z') &&
        timestamp <= new Date('2024-01-16T00:00:00Z')
      );
      if (timePeriod === 'future') return timestamp > new Date('2024-01-16T00:00:00Z');
      return true;
    });
  };

  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    if (equityLensActive) {
      setSelectedNode(null);
      return;
    }

    const filteredHazards = getFilteredHazards();
    const allNodes = [...filteredHazards, ...communityData.features];
    
    for (let i = 0; i < allNodes.length; i++) {
      const feature = allNodes[i];
      const isHazard = 'severity' in feature.properties;
      
      const x = (i + 1) * (canvas.width / (allNodes.length + 1));
      const y = isHazard ? canvas.height * 0.3 : canvas.height * 0.7;
      const radius = isHazard
        ? feature.properties.severity * 20 + 10
        : Math.min(feature.properties.population / 10000, 15) + 5;

      const dx = clickX - x;
      const dy = clickY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < radius + 5) {
        setSelectedNode({
          id: feature.properties.id,
          type: isHazard ? 'hazard' : 'community',
          properties: feature.properties,
          x: x / scaleX,
          y: y / scaleY
        });
        return;
      }
    }

    setSelectedNode(null);
  }, [equityLensActive, timePeriod]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('click', handleCanvasClick);
    return () => canvas.removeEventListener('click', handleCanvasClick);
  }, [handleCanvasClick]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (equityLensActive) {
        drawNetworkGraph(ctx, canvas);
      } else {
        drawStandardMap(ctx, canvas);
      }
      
      if (selectedNode && !equityLensActive) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(selectedNode.x, selectedNode.y, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
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
  }, [equityLensActive, isPlaying, visibleLayers, timePeriod, selectedNode]);

  const drawStandardMap = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw subtle grid
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

    // Draw city landmarks as subtle background elements
    ctx.fillStyle = 'rgba(100, 100, 255, 0.05)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 10 + Math.random() * 40;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const filteredHazards = getFilteredHazards();

    // Draw hazard nodes with pulsing effect
    filteredHazards.forEach((feature, index) => {
      if (!visibleLayers[feature.properties.type as keyof VisibleLayers]) return;

      const x = (index + 1) * (width / (filteredHazards.length + 1));
      const y = height * 0.3;
      const radius = feature.properties.severity * 20 + 10;
      const time = Date.now() * 0.001;

      // Pulsing effect
      const pulse = Math.sin(time * 2) * 3 + 1;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2 + pulse);
      gradient.addColorStop(0, getHazardColor(feature.properties.type, 0.8));
      gradient.addColorStop(1, getHazardColor(feature.properties.type, 0));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2 + pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = getHazardColor(feature.properties.type, 1);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = getHazardColor(feature.properties.type, 0.8);
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(feature.properties.name, x, y + radius + 20);
    });

    if (visibleLayers.communities) {
      communityData.features.forEach((feature, index) => {
        const x = (index + 1) * (width / (communityData.features.length + 1));
        const y = height * 0.7;
        const radius = Math.min(feature.properties.population / 10000, 15) + 5;

        ctx.fillStyle = getVulnerabilityColor(feature.properties.vulnerabilityIndex);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect for communities
        ctx.shadowColor = getVulnerabilityColor(feature.properties.vulnerabilityIndex);
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(feature.properties.name, x, y + radius + 20);
      });
    }
  };

  const drawNetworkGraph = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() * 0.001;

    // Create a starry background effect
    ctx.fillStyle = 'rgba(10, 10, 18, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const nodes: Node[] = [];
    const links: Link[] = [];

    const filteredHazards = getFilteredHazards();

    // Create hazard nodes in a circular pattern
    filteredHazards.forEach((feature, index) => {
      if (!visibleLayers[feature.properties.type as keyof VisibleLayers]) return;

      const angle = (index / filteredHazards.length) * Math.PI * 2;
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

    // Create community nodes in an inner circle
    if (visibleLayers.communities) {
      communityData.features.forEach((feature, index) => {
        const angle = (index / communityData.features.length) * Math.PI * 2;
        const radius = Math.min(width, height) * 0.15;
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

    // Create connections between hazards and communities
    if (visibleLayers.connections) {
      nodes.forEach(source => {
        if (source.type === 'hazard') {
          nodes.forEach(target => {
            if (target.type === 'community') {
              const dx = source.x - target.x;
              const dy = source.y - target.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < Math.min(width, height) * 0.4) {
                links.push({
                  source,
                  target,
                  weight: 1 - (distance / (Math.min(width, height) * 0.4)),
                  type: source.properties.type
                });
              }
            }
          });
        }
      });
    }

    // Draw connections with animated flow
    links.forEach(link => {
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.strokeStyle = getHazardColor(link.type, 0.3 * link.weight);
      ctx.lineWidth = 2 * link.weight;
      ctx.stroke();

      // Add animated particles along the connection lines
      const progress = (time * 0.5) % 1;
      const particleX = link.source.x + (link.target.x - link.source.x) * progress;
      const particleY = link.source.y + (link.target.y - link.source.y) * progress;
      
      ctx.fillStyle = getHazardColor(link.type, 1);
      ctx.beginPath();
      ctx.arc(particleX, particleY, 2 * link.weight, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw nodes with pulsing effect
    nodes.forEach(node => {
      if (node.type === 'hazard') {
        const radius = node.properties.severity * 15 + 5;
        const pulse = Math.sin(time * 3) * 2 + 1;
        
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2 + pulse);
        gradient.addColorStop(0, getHazardColor(node.properties.type, 0.8));
        gradient.addColorStop(1, getHazardColor(node.properties.type, 0));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2 + pulse, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = getHazardColor(node.properties.type, 1);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = getHazardColor(node.properties.type, 0.8);
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        const radius = node.properties.population / 15000;
        const pulse = Math.sin(time * 2) * 1 + 1;
        
        ctx.fillStyle = getVulnerabilityColor(node.properties.vulnerabilityIndex);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = getVulnerabilityColor(node.properties.vulnerabilityIndex);
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
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

  const toggleLayer = (layerName: keyof VisibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-20"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
            }}
            animate={{
              x: [Math.random() * 100 + 'vw', Math.random() * 100 + 'vw'],
              y: [Math.random() * 100 + 'vh', Math.random() * 100 + 'vh'],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      {/* Canvas Container */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block items-center z-10 relative"
      />
      
      {/* UI Controls - Fixed positioning and width */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 w-72">
        {/* Main View Toggle */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-xl shadow-lg px-5 py-3 flex items-center gap-2 transition-all duration-300 ${
            equityLensActive 
              ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 hover:bg-indigo-700' 
              : 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20'
          }`}
          onClick={() => setEquityLensActive(!equityLensActive)}
        >
          <FiEye className="text-lg" />
          <span className="font-medium">{equityLensActive ? 'Map View' : 'Equity Lens'}</span>
        </motion.button>

        {/* Collapsible Controls Container */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden"
        >
          {/* Time Controls Header */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition"
            onClick={() => setShowTimeControls(!showTimeControls)}
          >
            <div className="flex items-center text-indigo-300">
              <FiClock className="mr-2 text-lg" />
              <span className="font-medium">Time Travel</span>
            </div>
            <motion.div
              animate={{ rotate: showTimeControls ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown />
            </motion.div>
          </div>
          
          {showTimeControls && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
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
                className="w-full h-2 bg-indigo-500/30 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Layer Controls */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden"
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition"
            onClick={() => setShowLayerControls(!showLayerControls)}
          >
            <div className="flex items-center text-indigo-300">
              <FiLayers className="mr-2 text-lg" />
              <span className="font-medium">Layers</span>
            </div>
            <motion.div
              animate={{ rotate: showLayerControls ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown />
            </motion.div>
          </div>
          
          {showLayerControls && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <div className="flex flex-col gap-3 text-white/90">
                <label className="cursor-pointer flex items-center hover:text-indigo-200 transition group">
                  <input
                    type="checkbox"
                    checked={visibleLayers.heat}
                    onChange={() => toggleLayer('heat')}
                    className="mr-3 accent-orange-400 w-4 h-4"
                  />
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2 group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm">Heat Hazards</span>
                </label>
                <label className="cursor-pointer flex items-center hover:text-indigo-200 transition group">
                  <input
                    type="checkbox"
                    checked={visibleLayers.flood}
                    onChange={() => toggleLayer('flood')}
                    className="mr-3 accent-blue-400 w-4 h-4"
                  />
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2 group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm">Flood Hazards</span>
                </label>
                <label className="cursor-pointer flex items-center hover:text-indigo-200 transition group">
                  <input
                    type="checkbox"
                    checked={visibleLayers.fire}
                    onChange={() => toggleLayer('fire')}
                    className="mr-3 accent-red-400 w-4 h-4"
                  />
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2 group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm">Fire Hazards</span>
                </label>
                <label className="cursor-pointer flex items-center hover:text-indigo-200 transition group">
                  <input
                    type="checkbox"
                    checked={visibleLayers.air}
                    onChange={() => toggleLayer('air')}
                    className="mr-3 accent-gray-400 w-4 h-4"
                  />
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2 group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm">Air Hazards</span>
                </label>
                <label className="cursor-pointer flex items-center hover:text-indigo-200 transition group">
                  <input
                    type="checkbox"
                    checked={visibleLayers.communities}
                    onChange={() => toggleLayer('communities')}
                    className="mr-3 accent-green-400 w-4 h-4"
                  />
                  <FiHome className="text-green-400 mr-2 group-hover:scale-125 transition-transform" />
                  <span className="text-sm">Communities</span>
                </label>
                <label className="cursor-pointer flex items-center hover:text-indigo-200 transition group">
                  <input
                    type="checkbox"
                    checked={visibleLayers.connections}
                    onChange={() => toggleLayer('connections')}
                    className="mr-3 accent-purple-400 w-4 h-4"
                  />
                  <FiGlobe className="text-purple-400 mr-2 group-hover:scale-125 transition-transform" />
                  <span className="text-sm">Connections</span>
                </label>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Simulation Controls */}
        {equityLensActive && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden w-full"
          >
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition"
              onClick={() => setShowSimulationControls(!showSimulationControls)}
            >
              <div className="flex items-center text-indigo-300">
                <FiPlay className="mr-2 text-lg" />
                <span className="font-medium">Simulation</span>
              </div>
              <motion.div
                animate={{ rotate: showSimulationControls ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown />
              </motion.div>
            </div>
            
            {showSimulationControls && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4"
              >
                <div className="flex flex-col gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                      isPlaying 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <FiPause /> : <FiPlay />}
                    {isPlaying ? 'Pause Simulation' : 'Start Simulation'}
                  </motion.button>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Speed:</span>
                    <div className="flex gap-2">
                      {[0.5, 1, 2].map(speed => (
                        <motion.button
                          key={speed}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`px-3 py-1 rounded-md transition ${
                            simulationSpeed === speed
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          onClick={() => setSimulationSpeed(speed)}
                        >
                          {speed}x
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Data Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="absolute top-4 left-4 z-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl w-80 overflow-hidden"
      >
        <div className="flex border-b border-white/10">
          <button 
            className={`flex-1 py-3 text-center transition ${activeTab === 'hazards' ? 'text-indigo-300 bg-white/5' : 'text-white/70'}`}
            onClick={() => setActiveTab('hazards')}
          >
            <FiAlertTriangle className="inline mr-2" />
            Hazards
          </button>
          <button 
            className={`flex-1 py-3 text-center transition ${activeTab === 'communities' ? 'text-indigo-300 bg-white/5' : 'text-white/70'}`}
            onClick={() => setActiveTab('communities')}
          >
            <FiUsers className="inline mr-2" />
            Communities
          </button>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {activeTab === 'hazards' ? (
            <div className="p-4 space-y-3">
              {hazardData.features.map(hazard => (
                <motion.div 
                  key={hazard.properties.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const index = hazardData.features.findIndex(f => f.properties.id === hazard.properties.id);
                    const x = (index + 1) * (rect.width / (hazardData.features.length + 1));
                    const y = rect.height * 0.3;
                    
                    setSelectedNode({
                      id: hazard.properties.id,
                      type: 'hazard',
                      properties: hazard.properties,
                      x: x,
                      y: y
                    });
                  }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: getHazardColor(hazard.properties.type, 1) }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{hazard.properties.name}</div>
                      <div className="text-xs text-white/70 capitalize">{hazard.properties.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{(hazard.properties.severity * 100).toFixed(0)}%</div>
                      <div className="text-xs text-white/70">Severity</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {communityData.features.map(community => (
                <motion.div 
                  key={community.properties.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const index = communityData.features.findIndex(f => f.properties.id === community.properties.id);
                    const x = (index + 1) * (rect.width / (communityData.features.length + 1));
                    const y = rect.height * 0.7;
                    
                    setSelectedNode({
                      id: community.properties.id,
                      type: 'community',
                      properties: community.properties,
                      x: x,
                      y: y
                    });
                  }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: getVulnerabilityColor(community.properties.vulnerabilityIndex) }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{community.properties.name}</div>
                      <div className="text-xs text-white/70">{formatNumber(community.properties.population)} people</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{(community.properties.vulnerabilityIndex * 100).toFixed(0)}%</div>
                      <div className="text-xs text-white/70">Vulnerability</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="absolute bottom-4  left-4 z-10 rounded-2xl p-5 w-60 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
      >
        <div className="flex items-center mb-3 text-indigo-300">
          <FiGlobe className="mr-2 text-lg" />
          <span className="font-bold tracking-wide">Legend</span>
        </div>

        <div className="space-y-3 text-white/90">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 shadow-md shadow-orange-500/60 mr-3"></div>
            <span className="text-sm">Heat Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md shadow-blue-500/60 mr-3"></div>
            <span className="text-sm">Flood Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-md shadow-red-500/60 mr-3"></div>
            <span className="text-sm">Fire Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-400 shadow-md shadow-gray-400/50 mr-3"></div>
            <span className="text-sm">Air Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-red-500 shadow-md shadow-green-500/40 mr-3"></div>
            <span className="text-sm">Community Vulnerability</span>
          </div>
        </div>
      </motion.div>

      {/* Selected Node Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-96 z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl p-5 w-80"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-indigo-300 font-bold text-lg">
                {selectedNode.properties.name}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedNode(null)} 
                className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <FiX size={20} />
              </motion.button>
            </div>
            <div className="text-white/80 text-sm space-y-3">
              {selectedNode.type === 'hazard' ? (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Type:</span>
                    <span className="font-medium capitalize px-3 py-1 rounded-full bg-white/10">
                      {selectedNode.properties.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Severity:</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-white/10 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${selectedNode.properties.severity * 100}%`,
                            background: getHazardColor(selectedNode.properties.type, 1)
                          }}
                        ></div>
                      </div>
                      <span className="font-medium w-10 text-right">{(selectedNode.properties.severity * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Detected:</span>
                    <span className="font-medium">{new Date(selectedNode.properties.timestamp).toLocaleDateString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Population:</span>
                    <span className="font-medium">{formatNumber(selectedNode.properties.population)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Vulnerability:</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full" 
                          style={{ width: `${selectedNode.properties.vulnerabilityIndex * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium w-10 text-right">{(selectedNode.properties.vulnerabilityIndex * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-8 w-full max-w-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-indigo-300 tracking-wide drop-shadow-lg">
                Welcome to Atlas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-white/90">
                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiEye className="text-indigo-300 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-300 mb-1">View Modes</h3>
                    <p className="text-sm">Switch between Map View and Equity Lens to see different perspectives of the data.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiLayers className="text-indigo-300 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-300 mb-1">Layers</h3>
                    <p className="text-sm">Toggle different data layers to focus on specific hazards and communities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiClock className="text-indigo-300 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-300 mb-1">Time Travel</h3>
                    <p className="text-sm">Explore how hazards have changed over time with the time slider.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                    <FiGlobe className="text-indigo-300 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-300 mb-1">Interact</h3>
                    <p className="text-sm">Click on any hazard or community to see detailed information about it.</p>
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
                onClick={() => setShowTutorial(false)}
              >
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 right-4 z-[1000] bg-white/10 backdrop-blur-xl border border-white/20 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 transition"
        onClick={() => setShowTutorial(true)}
        title="Show Tutorial"
      >
        <FiInfo className="text-xl" />
      </motion.button>

      {/* Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 text-white text-xs p-3 flex justify-between items-center backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full ${equityLensActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-blue-500/20 text-blue-300'}`}>
            {equityLensActive ? 'Equity Lens' : 'Map View'}
          </div>
          <div className="text-white/70">
            {timePeriod === 'past' ? 'Viewing Past Data' : 
            timePeriod === 'present' ? 'Viewing Current Data' : 'Viewing Future Projections'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white/70">
            {hazardData.features.length} Hazards
          </div>
          <div className="text-white/70">
            {communityData.features.length} Communities
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div className="text-white/70">Connected</div>
        </div>
      </motion.div>

      {/* Custom CSS for slider thumb */}
      <style>
        {`
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #6366f1;
            cursor: pointer;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
          }
          
          .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #6366f1;
            cursor: pointer;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
            border: none;
          }
        `}
      </style>
    </div>
  );
};

export default Atlas;