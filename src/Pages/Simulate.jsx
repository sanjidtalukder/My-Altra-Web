import React, { useState, useEffect, useRef } from 'react';
import { FiChevronRight, FiGlobe, FiTrendingUp, FiTrendingDown, FiClock, FiCheck, FiBarChart2, FiLayers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const UrbanScenarioSimulator = () => {
  const [activeScenario, setActiveScenario] = useState('greenspace');
  const [timeframe, setTimeframe] = useState(12); // months
  const [metrics, setMetrics] = useState({
    heatIndex: 42,
    airQuality: 156,
    floodRisk: 34,
    wasteStress: 68
  });
  const [projectedMetrics, setProjectedMetrics] = useState({...metrics});
  const [isPositiveImpact, setIsPositiveImpact] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  // Scenario definitions
  const scenarios = [
    { id: 'greenspace', name: 'Add Green Spaces', icon: '🌳', color: 'green', description: 'Increase urban greenery by 25% across all districts' },
    { id: 'drainage', name: 'Improve Drainage', icon: '💧', color: 'blue', description: 'Upgrade drainage infrastructure in flood-prone areas' },
    { id: 'recycling', name: 'Expand Recycling', icon: '♻', color: 'indigo', description: 'Implement city-wide recycling program with 85% participation' },
    { id: 'solar', name: 'Deploy Solar Grids', icon: '☀', color: 'yellow', description: 'Install solar panels on municipal buildings and incentives for residents' },
    { id: 'heat', name: 'Heat Mitigation', icon: '🌡', color: 'red', description: 'Implement cool pavement technology and urban canopy initiatives' }
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create city buildings
    const buildings = [];
    for (let i = 0; i < 30; i++) {
      const width = Math.random() * 2 + 1;
      const height = Math.random() * 5 + 5;
      const depth = Math.random() * 2 + 1;
      
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x334155,
        emissive: 0x1e293b,
        specular: 0x64748b,
        shininess: 30
      });
      
      const building = new THREE.Mesh(geometry, material);
      building.position.x = (Math.random() - 0.5) * 20;
      building.position.z = (Math.random() - 0.5) * 20;
      building.position.y = height / 2;
      
      scene.add(building);
      buildings.push(building);
    }

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1e293b,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate buildings slightly
      buildings.forEach(building => {
        building.rotation.y += 0.001;
      });

      // Slowly rotate camera
      camera.position.x = 15 * Math.sin(Date.now() * 0.0003);
      camera.position.z = 15 * Math.cos(Date.now() * 0.0003);
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Simulate impact based on scenario and timeframe
  useEffect(() => {
    const calculateImpact = () => {
      setIsSimulating(true);
      setSimulationProgress(0);
      
      const impactFactors = {
        greenspace: { heatIndex: -0.8, airQuality: -1.2, floodRisk: -0.3, wasteStress: -0.2 },
        drainage: { heatIndex: -0.2, airQuality: 0.1, floodRisk: -1.5, wasteStress: 0.1 },
        recycling: { heatIndex: -0.3, airQuality: -0.7, floodRisk: 0, wasteStress: -1.8 },
        solar: { heatIndex: -1.5, airQuality: -0.9, floodRisk: 0, wasteStress: -0.4 },
        heat: { heatIndex: -1.7, airQuality: -0.5, floodRisk: -0.2, wasteStress: -0.1 }
      };

      const factor = impactFactors[activeScenario];
      const timeFactor = timeframe / 12; // Normalize to 1 year
      
      const newMetrics = {
        heatIndex: Math.max(20, metrics.heatIndex + (factor.heatIndex * timeFactor)),
        airQuality: Math.max(0, metrics.airQuality + (factor.airQuality * timeFactor)),
        floodRisk: Math.max(0, Math.min(100, metrics.floodRisk + (factor.floodRisk * timeFactor))),
        wasteStress: Math.max(0, Math.min(100, metrics.wasteStress + (factor.wasteStress * timeFactor)))
      };
      
      // Animate the progress
      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setProjectedMetrics(newMetrics);
            setIsSimulating(false);
            
            // Check if overall impact is positive (more metrics improved than worsened)
            const improvements = [
              newMetrics.heatIndex < metrics.heatIndex,
              newMetrics.airQuality < metrics.airQuality,
              newMetrics.floodRisk < metrics.floodRisk,
              newMetrics.wasteStress < metrics.wasteStress
            ].filter(Boolean).length;
            
            setIsPositiveImpact(improvements >= 3);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    };

    calculateImpact();
  }, [activeScenario, timeframe, metrics]);

  const getTrendIcon = (current, projected) => {
    if (projected < current) return <FiTrendingDown className="text-green-400" />;
    if (projected > current) return <FiTrendingUp className="text-red-400" />;
    return <span className="text-gray-400">—</span>;
  };

  const getChangePercentage = (current, projected) => {
    const change = ((projected - current) / current) * 100;
    return change === 0 ? '0%' : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getChangeColor = (current, projected) => {
    if (projected < current) return 'text-green-400';
    if (projected > current) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatMetric = (metric, type) => {
    switch(type) {
      case 'heatIndex': return `${metric.toFixed(1)}°C`;
      case 'airQuality': return `${Math.round(metric)} AQI`;
      case 'floodRisk': return `${Math.round(metric)}%`;
      case 'wasteStress': return `${Math.round(metric)}%`;
      default: return metric;
    }
  };

  // Add scenario-specific 3D elements to the scene
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear previous scenario elements
    const scene = sceneRef.current;
    scene.children.forEach(child => {
      if (child.userData && child.userData.isScenarioElement) {
        scene.remove(child);
      }
    });
    
    // Add new scenario elements
    switch(activeScenario) {
      case 'greenspace':
        // Add trees
        for (let i = 0; i < 15; i++) {
          const treeGeometry = new THREE.ConeGeometry(0.5, 2, 8);
          const treeMaterial = new THREE.MeshPhongMaterial({ color: 0x22c55e });
          const tree = new THREE.Mesh(treeGeometry, treeMaterial);
          tree.position.x = (Math.random() - 0.5) * 20;
          tree.position.z = (Math.random() - 0.5) * 20;
          tree.position.y = 1;
          tree.userData = { isScenarioElement: true };
          scene.add(tree);
        }
        break;
        
      case 'drainage':
        // Add water elements
        for (let i = 0; i < 10; i++) {
          const waterGeometry = new THREE.PlaneGeometry(3, 3);
          const waterMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.7
          });
          const water = new THREE.Mesh(waterGeometry, waterMaterial);
          water.rotation.x = -Math.PI / 2;
          water.position.x = (Math.random() - 0.5) * 15;
          water.position.z = (Math.random() - 0.5) * 15;
          water.position.y = 0.1;
          water.userData = { isScenarioElement: true };
          scene.add(water);
        }
        break;
        
      case 'solar':
        // Add solar panels
        for (let i = 0; i < 12; i++) {
          const panelGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
          const panelMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xf59e0b,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.3
          });
          const panel = new THREE.Mesh(panelGeometry, panelMaterial);
          panel.position.x = (Math.random() - 0.5) * 18;
          panel.position.z = (Math.random() - 0.5) * 18;
          panel.position.y = 0.5;
          panel.rotation.y = Math.random() * Math.PI;
          panel.userData = { isScenarioElement: true };
          scene.add(panel);
        }
        break;
        
      default:
        break;
    }
  }, [activeScenario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 p-4 md:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Urban Scenario Simulator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 mt-2"
          >
            Test "what-if" scenarios and see projected impacts on urban health
          </motion.p>
        </header>

        {/* Scenario Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 border border-gray-700/30"
        >
          <h2 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
            <FiLayers className="mr-2" />
            Select Scenario
          </h2>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {scenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveScenario(scenario.id)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all ${
                  activeScenario === scenario.id
                    ? `bg-${scenario.color}-900/30 text-white border border-${scenario.color}-500/50`
                    : 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30'
                }`}
              >
                <span className="text-2xl mb-1">{scenario.icon}</span>
                <span className="text-xs font-medium">{scenario.name}</span>
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeScenario}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 text-sm mt-4"
            >
              {scenarios.find(s => s.id === activeScenario)?.description}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Impact Preview Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-700/30"
          >
            <h2 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <FiGlobe className="mr-2" />
              Impact Visualization
            </h2>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden border border-gray-700/30">
              <div ref={containerRef} className="absolute inset-0" />
              <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{scenarios.find(s => s.id === activeScenario)?.icon}</span>
                  <span>{scenarios.find(s => s.id === activeScenario)?.name} Simulation</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Dashboard */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-700/30"
          >
            <h2 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <FiBarChart2 className="mr-2" />
              Projected Impact
            </h2>
            <div className="space-y-4">
              {/* Heat Index Card */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Heat Index</h3>
                  {getTrendIcon(metrics.heatIndex, projectedMetrics.heatIndex)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">
                    {formatMetric(projectedMetrics.heatIndex, 'heatIndex')}
                  </div>
                  <div className={getChangeColor(metrics.heatIndex, projectedMetrics.heatIndex)}>
                    {getChangePercentage(metrics.heatIndex, projectedMetrics.heatIndex)}
                  </div>
                </div>
              </motion.div>

              {/* Air Quality Card */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Air Quality Score</h3>
                  {getTrendIcon(metrics.airQuality, projectedMetrics.airQuality)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">
                    {formatMetric(projectedMetrics.airQuality, 'airQuality')}
                  </div>
                  <div className={getChangeColor(metrics.airQuality, projectedMetrics.airQuality)}>
                    {getChangePercentage(metrics.airQuality, projectedMetrics.airQuality)}
                  </div>
                </div>
              </motion.div>

              {/* Flood Risk Card */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Flood Risk Level</h3>
                  {getTrendIcon(metrics.floodRisk, projectedMetrics.floodRisk)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">
                    {formatMetric(projectedMetrics.floodRisk, 'floodRisk')}
                  </div>
                  <div className={getChangeColor(metrics.floodRisk, projectedMetrics.floodRisk)}>
                    {getChangePercentage(metrics.floodRisk, projectedMetrics.floodRisk)}
                  </div>
                </div>
              </motion.div>

              {/* Waste Stress Card */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Waste Stress Index</h3>
                  {getTrendIcon(metrics.wasteStress, projectedMetrics.wasteStress)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">
                    {formatMetric(projectedMetrics.wasteStress, 'wasteStress')}
                  </div>
                  <div className={getChangeColor(metrics.wasteStress, projectedMetrics.wasteStress)}>
                    {getChangePercentage(metrics.wasteStress, projectedMetrics.wasteStress)}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Timeline Slider */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-700/30 mb-6"
        >
          <h2 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
            <FiClock className="mr-2" />
            Projection Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Short-term (1 month)</span>
              <span>Long-term (5 years)</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={timeframe}
              onChange={(e) => setTimeframe(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">{timeframe} month{timeframe !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">
                {timeframe < 12 
                  ? `${timeframe} month projection` 
                  : `${(timeframe / 12).toFixed(1)} year projection`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Commit to Blueprint Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: isPositiveImpact ? 1.05 : 1 }}
            whileTap={{ scale: isPositiveImpact ? 0.95 : 1 }}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center mx-auto ${
              isPositiveImpact
                ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg shadow-green-500/30'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-70'
            }`}
            disabled={!isPositiveImpact}
          >
            {isSimulating ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Simulating... {simulationProgress}%
              </div>
            ) : isPositiveImpact ? (
              <>
                <FiCheck className="mr-2" />
                Commit to Blueprint
              </>
            ) : (
              'Simulate positive impact to enable'
            )}
          </motion.button>
          {isPositiveImpact && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 mt-3"
            >
              This scenario shows positive impact across key metrics
            </motion.p>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>
    </div>
  );
};

export default UrbanScenarioSimulator;