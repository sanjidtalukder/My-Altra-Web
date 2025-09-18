import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FiArrowUp, FiArrowDown, FiMap, FiActivity, FiLayers, FiBarChart2, FiZap, FiClock, FiAlertTriangle, FiCheckCircle, FiUser, FiDatabase } from 'react-icons/fi';

const PulseThree = () => {
  const containerRef = useRef(null);
  const [cwi, setCwi] = useState(72);
  const [pulseRate, setPulseRate] = useState(68);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeHazard, setActiveHazard] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [showIntervention, setShowIntervention] = useState(false);
  const [cityData, setCityData] = useState({
    population: 1250000,
    area: 325,
    districts: 18,
    lastUpdate: new Date()
  });

  // Simulate day/night cycle
  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour > 6 && hour < 20 ? 'day' : 'night');
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Lighting based on time of day
    const ambientLight = new THREE.AmbientLight(timeOfDay === 'day' ? 0x444444 : 0x222244);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(timeOfDay === 'day' ? 0x3366ff : 0x4466aa, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create network nodes
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    
    for (let i = 0; i < 150; i++) {
      const isHazard = Math.random() > 0.9;
      const color = isHazard ? 0xff3366 : (Math.random() > 0.7 ? 0x33ff66 : 0x3366ff);
      
      const material = new THREE.MeshBasicMaterial({ 
        color,
        emissive: isHazard ? 0xff3366 : 0x000000,
        emissiveIntensity: isHazard ? 0.5 : 0
      });
      
      const node = new THREE.Mesh(nodeGeometry, material);
      node.position.x = (Math.random() - 0.5) * 12;
      node.position.y = (Math.random() - 0.5) * 8;
      node.position.z = (Math.random() - 0.5) * 3;
      
      // Add random movement to nodes
      node.userData = {
        speed: 0.001 + Math.random() * 0.005,
        direction: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      };
      
      scene.add(node);
      nodes.push(node);
    }
    
    // Create connections between nodes
    const edges = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.95) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < 5) {
            const edgeGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(
                nodes[i].position.x, 
                nodes[i].position.y, 
                nodes[i].position.z
              ),
              new THREE.Vector3(
                nodes[j].position.x, 
                nodes[j].position.y, 
                nodes[j].position.z
              )
            ]);
            
            const isHazardConnection = nodes[i].material.emissiveIntensity > 0 || 
                                      nodes[j].material.emissiveIntensity > 0;
            
            const edgeMaterial = new THREE.LineBasicMaterial({ 
              color: isHazardConnection ? 0xff3366 : 0x3366ff,
              transparent: true,
              opacity: isHazardConnection ? 0.6 : 0.2
            });
            
            const line = new THREE.Line(edgeGeometry, edgeMaterial);
            scene.add(line);
            edges.push({line, node1: nodes[i], node2: nodes[j]});
          }
        }
      }
    }
    
    // Add pulsing spheres for hazards
    const pulseSpheres = [];
    nodes.forEach(node => {
      if (node.material.emissiveIntensity > 0) {
        const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xff3366,
          transparent: true,
          opacity: 0.3,
          wireframe: true
        });
        
        const pulseSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        pulseSphere.position.copy(node.position);
        scene.add(pulseSphere);
        pulseSpheres.push(pulseSphere);
      }
    });
    
    // Position camera
    camera.position.z = 7;
    
    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate nodes
      nodes.forEach(node => {
        // Move nodes slightly
        node.position.x += node.userData.direction.x * node.userData.speed;
        node.position.y += node.userData.direction.y * node.userData.speed;
        node.position.z += node.userData.direction.z * node.userData.speed;
        
        // Bounce off imaginary walls
        if (Math.abs(node.position.x) > 6) node.userData.direction.x *= -1;
        if (Math.abs(node.position.y) > 4) node.userData.direction.y *= -1;
        if (Math.abs(node.position.z) > 1.5) node.userData.direction.z *= -1;
        
        // Pulse effect based on CWI
        const scale = 1 + Math.sin(Date.now() * 0.002) * (0.05 + (100 - cwi) / 500);
        node.scale.set(scale, scale, scale);
      });
      
      // Animate edges
      edges.forEach(edge => {
        // Update edge positions
        edge.line.geometry.setFromPoints([
          new THREE.Vector3(
            edge.node1.position.x, 
            edge.node1.position.y, 
            edge.node1.position.z
          ),
          new THREE.Vector3(
            edge.node2.position.x, 
            edge.node2.position.y, 
            edge.node2.position.z
          )
        ]);
        edge.line.geometry.attributes.position.needsUpdate = true;
        
        // Pulse opacity
        edge.line.material.opacity = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;
      });
      
      // Animate pulse spheres
      pulseSpheres.forEach(sphere => {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.5;
        sphere.scale.set(scale, scale, scale);
        sphere.material.opacity = 0.2 + Math.sin(Date.now() * 0.002) * 0.2;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      });
      
      // Slowly rotate camera
      camera.position.x = 7 * Math.sin(Date.now() * 0.0003);
      camera.position.z = 7 * Math.cos(Date.now() * 0.0003);
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Dispose of geometries and materials
      nodeGeometry.dispose();
      nodes.forEach(node => node.material.dispose());
      edges.forEach(edge => {
        edge.line.geometry.dispose();
        edge.line.material.dispose();
      });
      pulseSpheres.forEach(sphere => {
        sphere.geometry.dispose();
        sphere.material.dispose();
      });
    };
  }, [cwi, timeOfDay]);
  
  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newCwi = Math.floor(Math.random() * 20 + 70); // Random CWI between 70-90
      setCwi(newCwi);
      setPulseRate(60 + (100 - newCwi));
      
      // Update city data timestamp
      setCityData(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Hazard data
  const hazards = [
    { 
      id: 1, 
      type: 'Heat Island', 
      location: 'Industrial District', 
      severity: 'Severe', 
      affected: '12,480 residents', 
      color: 'red', 
      temperature: '42°C',
      trend: 'rising',
      history: [38, 40, 41, 42],
      response: 'Cooling centers activated'
    },
    { 
      id: 2, 
      type: 'Flood Risk', 
      location: 'Northern Sector', 
      severity: 'High', 
      affected: '6,200 residents', 
      color: 'blue', 
      risk: '34%',
      trend: 'stable',
      history: [30, 32, 33, 34],
      response: 'Drainage systems optimized'
    },
    { 
      id: 3, 
      type: 'Air Quality', 
      location: 'City Center', 
      severity: 'Moderate', 
      affected: '8,750 residents', 
      color: 'yellow', 
      aqi: '156',
      trend: 'improving',
      history: [180, 170, 162, 156],
      response: 'Traffic rerouted, industrial limits'
    },
    { 
      id: 4, 
      type: 'Energy Demand', 
      location: 'Commercial District', 
      severity: 'High', 
      affected: 'All sectors', 
      color: 'purple', 
      consumption: '98%',
      trend: 'rising',
      history: [85, 90, 94, 98],
      response: 'Renewable sources activated'
    }
  ];
  
  // Calculate pulse animation duration based on CWI
  const pulseDuration = 6 - (cwi / 20);
  
  // Intervention simulation
  const simulateIntervention = () => {
    setShowIntervention(true);
    // Simulate improvement after intervention
    setTimeout(() => {
      setCwi(prev => Math.min(prev + 12, 100));
      setPulseRate(prev => prev - 10);
    }, 1000);
    
    // Reset after 5 seconds
    setTimeout(() => setShowIntervention(false), 5000);
  };

  // Get color classes for hazards
  const getColorClass = (color, type) => {
    const colorMap = {
      red: {
        bg: 'bg-red-500',
        text: 'text-red-400',
        border: 'border-red-500',
        light: 'bg-red-900 bg-opacity-50'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-400',
        border: 'border-blue-500',
        light: 'bg-blue-900 bg-opacity-50'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-400',
        border: 'border-yellow-500',
        light: 'bg-yellow-900 bg-opacity-50'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-400',
        border: 'border-purple-500',
        light: 'bg-purple-900 bg-opacity-50'
      }
    };
    
    return colorMap[color]?.[type] || '';
  };

  // Render appropriate content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'map':
        return renderMapContent();
      case 'analytics':
        return renderAnalyticsContent();
      case 'intervene':
        return renderInterveneContent();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      {/* Pulse visualization */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-200">CITY WELLBEING INDEX</h2>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse" style={{animationDuration: `${pulseDuration}s`}}></div>
            <span className="text-green-400 font-medium">Pulse: {pulseRate} BPM</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            <div className="w-64 h-64 rounded-full border-4 border-green-500 border-opacity-30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400">{cwi}</div>
                <div className="text-blue-200 mt-2">Current Index</div>
              </div>
            </div>
            
            {/* Pulse rings */}
            <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-0 animate-pulse"
              style={{animationDuration: `${pulseDuration}s`}}></div>
            <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-0 animate-pulse"
              style={{animationDuration: `${pulseDuration}s`, animationDelay: '1s'}}></div>
            <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-0 animate-pulse"
              style={{animationDuration: `${pulseDuration}s`, animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center">
            <div className="text-red-400 text-2xl font-bold">38%</div>
            <div className="text-blue-200 text-sm mt-1">Environmental Stress</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center">
            <div className="text-green-400 text-2xl font-bold">65%</div>
            <div className="text-blue-200 text-sm mt-1">Social Vitality</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">82%</div>
            <div className="text-blue-200 text-sm mt-1">Infrastructure</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center">
            <div className="text-purple-400 text-2xl font-bold">74%</div>
            <div className="text-blue-200 text-sm mt-1">Community</div>
          </div>
        </div>
      </div>
      
      {/* City stats panel */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl mt-6">
        <h2 className="text-xl font-semibold text-blue-200 mb-4">CITY STATISTICS</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-blue-200">Population</span>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{cityData.population.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-blue-200">Area</span>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{cityData.area} km²</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-blue-200">Districts</span>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{cityData.districts}</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-blue-200">Last Update</span>
            </div>
            <div className="text-xl font-bold text-white mt-2">{cityData.lastUpdate.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderMapContent = () => (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-200">URBAN MONITORING MAP</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-all">Heat</button>
          <button className="px-3 py-1 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-all">Flood</button>
          <button className="px-3 py-1 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-all">Air</button>
        </div>
      </div>
      
      <div className="bg-gray-800 bg-opacity-50 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
        {/* Simplified map representation */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-green-400 rounded-full filter blur-xl"></div>
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 left-0 right-0 border border-gray-500" 
              style={{left: `${i * 5}%`, width: '1px'}}></div>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 left-0 right-0 border border-gray-500" 
              style={{top: `${i * 5}%`, height: '1px'}}></div>
          ))}
        </div>
        
        {/* Hazard markers */}
        {hazards.map((hazard, i) => (
          <div key={hazard.id} 
            className={`absolute w-8 h-8 rounded-full ${getColorClass(hazard.color, 'bg')} flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform`}
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + i * 10}%`,
              boxShadow: `0 0 15px ${hazard.color === 'red' ? '#f56565' : hazard.color === 'blue' ? '#4299e1' : hazard.color === 'yellow' ? '#ecc94b' : '#a78bfa'}`
            }}
            onMouseEnter={() => setActiveHazard(hazard.id)}
            onMouseLeave={() => setActiveHazard(null)}
          >
            <span className="text-white font-bold text-xs">{hazard.type.charAt(0)}</span>
          </div>
        ))}
        
        {/* Connection lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-1/4 h-px bg-red-500 transform rotate-45" style={{top: '30%', left: '20%'}}></div>
          <div className="absolute w-1/4 h-px bg-blue-500 transform rotate-30" style={{top: '40%', left: '45%'}}></div>
          <div className="absolute w-1/4 h-px bg-yellow-500 transform rotate-60" style={{top: '50%', left: '70%'}}></div>
        </div>
        
        <div className="text-gray-400 text-center z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-2">Interactive Urban Monitoring Map</p>
        </div>
      </div>
      
      {/* Map legend */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Heat Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">Flood Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm">Air Quality</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <span className="text-sm">Energy Demand</span>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-200">ANALYTICS DASHBOARD</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-all">7D</button>
            <button className="px-3 py-1 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-all">30D</button>
            <button className="px-3 py-1 rounded border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition-all">90D</button>
          </div>
        </div>
        
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-200">Heat Index</h3>
                <div className="text-3xl font-bold text-red-400 mt-2">42°C</div>
              </div>
              <div className="flex items-center text-red-400">
                <FiArrowUp className="mr-1" />
                <span>12%</span>
              </div>
            </div>
            <div className="mt-4 h-24">
              <div className="relative h-full">
                <div className="absolute bottom-0 left-0 right-0 bg-red-900 bg-opacity-30 rounded-t-lg" style={{height: '70%'}}></div>
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 rounded-t-lg" style={{height: '40%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-200">Air Quality</h3>
                <div className="text-3xl font-bold text-yellow-400 mt-2">156 AQI</div>
              </div>
              <div className="flex items-center text-green-400">
                <FiArrowDown className="mr-1" />
                <span>8%</span>
              </div>
            </div>
            <div className="mt-4 h-24">
              <div className="relative h-full">
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-900 bg-opacity-30 rounded-t-lg" style={{height: '60%'}}></div>
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 rounded-t-lg" style={{height: '35%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-200">Flood Risk</h3>
                <div className="text-3xl font-bold text-blue-400 mt-2">34%</div>
              </div>
              <div className="flex items-center text-blue-400">
                <span>Stable</span>
              </div>
            </div>
            <div className="mt-4 h-24">
              <div className="relative h-full">
                <div className="absolute bottom-0 left-0 right-0 bg-blue-900 bg-opacity-30 rounded-t-lg" style={{height: '50%'}}></div>
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg" style={{height: '34%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-200">Energy Demand</h3>
                <div className="text-3xl font-bold text-purple-400 mt-2">98%</div>
              </div>
              <div className="flex items-center text-red-400">
                <FiArrowUp className="mr-1" />
                <span>5%</span>
              </div>
            </div>
            <div className="mt-4 h-24">
              <div className="relative h-full">
                <div className="absolute bottom-0 left-0 right-0 bg-purple-900 bg-opacity-30 rounded-t-lg" style={{height: '80%'}}></div>
                <div className="absolute bottom-0 left-0 right-0 bg-purple-500 rounded-t-lg" style={{height: '78%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Correlation matrix */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
        <h2 className="text-xl font-semibold text-blue-200 mb-4">RISK CORRELATION MATRIX</h2>
        <div className="grid grid-cols-5 gap-2">
          <div></div>
          <div className="text-center text-sm text-blue-200">Heat</div>
          <div className="text-center text-sm text-blue-200">Flood</div>
          <div className="text-center text-sm text-blue-200">Air</div>
          <div className="text-center text-sm text-blue-200">Energy</div>
          
          <div className="text-sm text-blue-200">Heat</div>
          <div className="bg-green-500 bg-opacity-30 rounded text-center p-2">1.0</div>
          <div className="bg-yellow-500 bg-opacity-30 rounded text-center p-2">0.72</div>
          <div className="bg-red-500 bg-opacity-30 rounded text-center p-2">0.85</div>
          <div className="bg-purple-500 bg-opacity-30 rounded text-center p-2">0.68</div>
          
          <div className="text-sm text-blue-200">Flood</div>
          <div className="bg-yellow-500 bg-opacity-30 rounded text-center p-2">0.72</div>
          <div className="bg-green-500 bg-opacity-30 rounded text-center p-2">1.0</div>
          <div className="bg-blue-500 bg-opacity-30 rounded text-center p-2">0.55</div>
          <div className="bg-purple-500 bg-opacity-30 rounded text-center p-2">0.42</div>
          
          <div className="text-sm text-blue-200">Air</div>
          <div className="bg-red-500 bg-opacity-30 rounded text-center p-2">0.85</div>
          <div className="bg-blue-500 bg-opacity-30 rounded text-center p-2">0.55</div>
          <div className="bg-green-500 bg-opacity-30 rounded text-center p-2">1.0</div>
          <div className="bg-purple-500 bg-opacity-30 rounded text-center p-2">0.78</div>
          
          <div className="text-sm text-blue-200">Energy</div>
          <div className="bg-purple-500 bg-opacity-30 rounded text-center p-2">0.68</div>
          <div className="bg-purple-500 bg-opacity-30 rounded text-center p-2">0.42</div>
          <div className="bg-purple-500 bg-opacity-30 rounded text-center p-2">0.78</div>
          <div className="bg-green-500 bg-opacity-30 rounded text-center p-2">1.0</div>
        </div>
      </div>
    </div>
  );

  const renderInterveneContent = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
        <h2 className="text-xl font-semibold text-blue-200 mb-6">INTERVENTION PLANNER</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center cursor-pointer hover:bg-blue-900 transition-all">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiZap className="text-white text-xl" />
            </div>
            <h3 className="font-medium">Emergency Response</h3>
            <p className="text-sm text-gray-400 mt-1">Immediate actions</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center cursor-pointer hover:bg-green-900 transition-all">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle className="text-white text-xl" />
            </div>
            <h3 className="font-medium">Long-term Solutions</h3>
            <p className="text-sm text-gray-400 mt-1">Sustainable projects</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center cursor-pointer hover:bg-purple-900 transition-all">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUser className="text-white text-xl" />
            </div>
            <h3 className="font-medium">Community Engagement</h3>
            <p className="text-sm text-gray-400 mt-1">Public participation</p>
          </div>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-200 mb-3">Proposed Interventions</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                <div>
                  <div className="font-medium">Install Cool Roofs</div>
                  <div className="text-sm text-gray-400">Industrial District</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3">-15°C</span>
                <button className="px-3 py-1 bg-blue-600 rounded text-white text-sm hover:bg-blue-700 transition-all">Deploy</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <div className="font-medium">Upgrade Drainage System</div>
                  <div className="text-sm text-gray-400">Northern Sector</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3">-22% risk</span>
                <button className="px-3 py-1 bg-blue-600 rounded text-white text-sm hover:bg-blue-700 transition-all">Deploy</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <div className="font-medium">Expand Green Spaces</div>
                  <div className="text-sm text-gray-400">City Center</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3">-32 AQI</span>
                <button className="px-3 py-1 bg-blue-600 rounded text-white text-sm hover:bg-blue-700 transition-all">Deploy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
        <h2 className="text-xl font-semibold text-blue-200 mb-4">INTERVENTION IMPACT SIMULATION</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <h3 className="font-medium text-blue-200 mb-2">Before Intervention</h3>
            <div className="text-4xl font-bold text-red-400 mb-2">72</div>
            <div className="text-sm text-gray-400">CWI Score</div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Heat Risk</span>
                <span className="text-red-400">42°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Flood Risk</span>
                <span className="text-blue-400">34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Air Quality</span>
                <span className="text-yellow-400">156 AQI</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
            <h3 className="font-medium text-blue-200 mb-2">After Intervention</h3>
            <div className="text-4xl font-bold text-green-400 mb-2">84</div>
            <div className="text-sm text-gray-400">CWI Score</div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Heat Risk</span>
                <span className="text-green-400">27°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Flood Risk</span>
                <span className="text-green-400">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Air Quality</span>
                <span className="text-green-400">124 AQI</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-blue-200">Implementation Timeline</span>
            <span className="text-blue-200">12 weeks</span>
          </div>
          <div className="w-full bg-gray-700 h-3 rounded-full">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{width: '45%'}}></div>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-400">
            <span>Week 1</span>
            <span>Week 6</span>
            <span>Week 12</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${timeOfDay === 'day' ? 'bg-gradient-to-br from-blue-900 to-indigo-950' : 'bg-gradient-to-br from-gray-900 to-gray-950'} text-white overflow-hidden`}>
      {/* Background elements */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-20 py-4 px-6 flex justify-between items-center bg-gray-900 bg-opacity-70 backdrop-blur-md border-b border-blue-500 border-opacity-20">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">CITY HEARTBEAT</h1>
        </div>
        
        <nav className="flex space-x-2 bg-gray-800 bg-opacity-50 rounded-xl p-1">
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-blue-900 bg-opacity-50 text-blue-100' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'map' ? 'bg-blue-900 bg-opacity-50 text-blue-100' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('map')}
          >
            Map
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-blue-900 bg-opacity-50 text-blue-100' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'intervene' ? 'bg-blue-900 bg-opacity-50 text-blue-100' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('intervene')}
          >
            Intervene
          </button>
        </nav>
        
        <div className="flex items-center">
          <div className="mr-4 text-sm">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </header>
      
      <main className="relative z-10">
        {/* Three.js canvas */}
        <div ref={containerRef} className="fixed inset-0 z-0" />
        
        {/* Main content area */}
        <div className="container mx-auto px-6 pt-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {renderTabContent()}
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Active risks panel */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-200 mb-4">TOP ACTIVE RISKS</h2>
              
              <div className="space-y-4">
                {hazards.map(hazard => (
                  <div 
                    key={hazard.id} 
                    className={`p-4 rounded-xl transition-all cursor-pointer ${
                      activeHazard === hazard.id ? getColorClass(hazard.color, 'light') : 'bg-gray-800 bg-opacity-50 hover:bg-gray-700'
                    }`}
                    onMouseEnter={() => setActiveHazard(hazard.id)}
                    onMouseLeave={() => setActiveHazard(null)}
                  >
                    <div className="flex items-start">
                      <div className={`w-3 h-3 rounded-full ${getColorClass(hazard.color, 'bg')} mt-1.5 mr-3`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{hazard.type} - {hazard.location}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-400">{hazard.severity}, affecting {hazard.affected}</span>
                          <span className={`${getColorClass(hazard.color, 'text')} font-bold`}>
                            {hazard.temperature || hazard.aqi || hazard.risk || hazard.consumption}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Trend: {hazard.trend} • {hazard.response}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-medium hover:from-blue-500 hover:to-blue-400 transition-all flex items-center justify-center"
                onClick={simulateIntervention}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Generate Intervention Report
              </button>
            </div>
            
            {/* Intervention impact panel */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-200 mb-4">INTERVENTION IMPACT</h2>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                {showIntervention ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-green-400 font-bold text-lg">Intervention Successful!</h3>
                    <p className="text-blue-200 mt-2">CWI increased by 12 points</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="mt-2">No active interventions</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-sm">Response Time</div>
                  <div className="text-white font-bold">4.2min</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-sm">Effectiveness</div>
                  <div className="text-white font-bold">87%</div>
                </div>
              </div>
            </div>
            
            {/* Status panel */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
              <h2 className="text-xl font-semibold text-blue-200 mb-4">SYSTEM STATUS</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Data Sources</span>
                  <span className="text-green-400 font-medium">Online</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Network Integrity</span>
                  <span className="text-green-400 font-medium">98%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Last Update</span>
                  <span className="text-blue-200">Just now</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Next Update</span>
                  <span className="text-blue-200">In 2 minutes</span>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-200">Storage</span>
                  <span className="text-blue-200">4.2TB / 10TB</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full" style={{width: '42%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Hover stat card */}
      {activeHazard && (
        <div className="fixed z-30 bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl p-4 w-64 border border-blue-500 border-opacity-30 shadow-2xl transition-all"
             style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <h3 className="font-semibold text-lg text-white">{hazards.find(h => h.id === activeHazard).type}</h3>
          <div className="flex items-center mt-2">
            <span className={`w-3 h-3 rounded-full ${getColorClass(hazards.find(h => h.id === activeHazard).color, 'bg')} mr-2`}></span>
            <span className={`${getColorClass(hazards.find(h => h.id === activeHazard).color, 'text')}`}>{hazards.find(h => h.id === activeHazard).severity}</span>
          </div>
          <div className="mt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white">{hazards.find(h => h.id === activeHazard).location}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-400">Affected:</span>
              <span className="text-white">{hazards.find(h => h.id === activeHazard).affected}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-400">Last update:</span>
              <span className="text-white">2 minutes ago</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-400">Response:</span>
              <span className="text-green-400">Intervention needed</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 py-3 px-6 bg-gray-900 bg-opacity-70 backdrop-blur-md border-t border-blue-500 border-opacity-20 flex justify-between items-center">
        <div className="text-sm text-blue-200">
          Urban Resilience Monitoring System • v2.4.1
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-400 text-sm">Systems Normal</span>
          </div>
          
          <div className="text-sm text-blue-200">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PulseThree;
