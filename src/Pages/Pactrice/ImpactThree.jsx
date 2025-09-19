import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { MapContainer, TileLayer, useMap, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Compare Slider Component
const CustomCompareSlider = ({ before, after, className }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let position = ((x - rect.left) / rect.width) * 100;
    
    // Keep position between 0 and 100
    position = Math.max(0, Math.min(100, position));
    setSliderPosition(position);
  };

  const handleEnd = () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchend', handleEnd);
  };

  const handleStart = (e) => {
    // Add event listeners for drag
    if (e.type === 'mousedown') {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
    } else {
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    
    handleMove(e);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {/* Before image */}
      <div className="absolute top-0 left-0 w-full h-full">
        {before}
      </div>
      
      {/* After image with clip path */}
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        {after}
      </div>
      
      {/* Slider control */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-3 h-8 bg-white rounded-sm"></div>
      </div>
    </div>
  );
};

const Impact = () => {
  // State variables
  const [impactMetrics, setImpactMetrics] = useState({
    peopleProtected: 125000,
    heatReduction: 2.5,
    floodRiskReduction: 35,
    airQualityImprovement: 22,
    greenSpaceAdded: 12.8
  });
  
  const [impactStory, setImpactStory] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef(null);

  // Project locations with impact data
  const projectLocations = [
    { id: 1, lat: 40.7128, lng: -74.0060, name: "Manhattan Green Corridor", result: "0.9°C cooling" },
    { id: 2, lat: 40.6782, lng: -73.9442, name: "Brooklyn Flood Barrier", result: "42% flood risk reduction" },
    { id: 3, lat: 40.7282, lng: -73.7942, name: "Queens Air Quality Initiative", result: "18% PM2.5 reduction" },
    { id: 4, lat: 40.8262, lng: -73.9162, name: "Bronx Urban Greening", result: "8.5 acres green space" },
    { id: 5, lat: 40.5795, lng: -74.1502, name: "Staten Island Wetland Restoration", result: "35% runoff reduction" }
  ];

  // Generate impact story from metrics
  const generateStory = () => {
    return `In the last quarter, New York City saw a ${impactMetrics.heatReduction}°C reduction in peak urban heat after green infrastructure was added to 12 city blocks. This intervention, combined with our flood mitigation efforts, has improved quality of life for over ${impactMetrics.peopleProtected.toLocaleString()} residents. Data from NASA's MODIS and Landsat satellites confirm these positive trends.`;
  };

  // Initialize component
  useEffect(() => {
    setIsVisible(true);
    setImpactStory(generateStory());
    
    // Add event listener for celebration particles
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => {
        const speed = parseFloat(particle.getAttribute('data-speed'));
        const x = (window.innerWidth - e.clientX * speed) / 100;
        const y = (window.innerHeight - e.clientY * speed) / 100;
        particle.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ripple Component for Map
  const Ripple = ({ center, radius, color, duration }) => {
    const map = useMap();
    const rippleRef = useRef();
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
      if (!rippleRef.current) return;
      
      const ripple = rippleRef.current;
      let startTime = null;
      let currentRadius = 0;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;
        
        if (progress < 1) {
          currentRadius = radius * progress;
          ripple.setRadius(currentRadius);
          const opacity = 0.7 * (1 - progress);
          ripple.setStyle({ fillOpacity: opacity });
          requestAnimationFrame(animate);
        } else {
          startTime = null;
          currentRadius = 0;
          ripple.setRadius(0);
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
      
      return () => {
        setIsActive(false);
      };
    }, [radius, duration]);

    return isActive ? (
      <Circle
        ref={rippleRef}
        center={center}
        radius={0}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: 1
        }}
      />
    ) : null;
  };

  // Project Marker Component
  const ProjectMarker = ({ project }) => {
    return (
      <Circle
        center={[project.lat, project.lng]}
        radius={200}
        pathOptions={{
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.3
        }}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">{project.name}</h3>
            <p className="text-sm">{project.result}</p>
          </div>
        </Popup>
      </Circle>
    );
  };

  // Key Metric Card Component
  const MetricCard = ({ icon, title, value, change, tooltip, unit = '' }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    return (
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-500 transition-all duration-300 group relative shadow-lg"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="text-emerald-400 text-3xl mb-2">{icon}</div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}{unit}</p>
        <p className="text-emerald-400 mt-1">{change}</p>
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-xs text-gray-300 p-2 rounded-md shadow-lg z-10">
            {tooltip}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6 overflow-x-hidden">
      {/* Celebration particles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-emerald-400 rounded-full opacity-70"
            data-speed={Math.random() * 5 + 2}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 2})`
            }}
          />
        ))}
      </div>

      {/* Hero Impact Counter */}
      <div className={`text-center mb-12 py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <CountUp
          end={impactMetrics.peopleProtected}
          duration={3}
          separator=","
          className="text-6xl md:text-8xl font-bold text-emerald-400 pulse-glow"
        />
        <p className="text-2xl mt-4 text-cyan-300">Lives Improved Through Data-Driven Action</p>
        <div className="mt-6 w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Before & After Comparison */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-center text-cyan-300">Heat Island Reduction in Midtown</h2>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <CustomCompareSlider
              className="h-64"
              before={
                <div className="relative h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1593537612370-46c0c0226c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Before intervention - heat island effect" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                    Before
                  </span>
                </div>
              }
              after={
                <div className="relative h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="After intervention - reduced heat" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                    After Green Infrastructure
                  </span>
                </div>
              }
            />
          </div>
          <p className="text-center text-gray-400 mt-4 text-sm">
            Data derived from MODIS Land Surface Temperature analysis
          </p>
        </div>

        {/* AI-Generated Impact Story */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-cyan-500/30 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400 flex items-center">
            <span className="mr-2">📈</span> Impact Story
          </h2>
          <div className="prose prose-invert">
            <p className="text-gray-300 leading-relaxed">{impactStory}</p>
          </div>
          <div className="mt-6 p-3 bg-gray-800 rounded-lg">
            <h3 className="font-bold text-emerald-400 mb-2 flex items-center">
              <span className="mr-2">🛰</span> NASA Data Sources
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li className="flex items-center">• <span className="ml-2">MODIS Land Surface Temperature</span></li>
              <li className="flex items-center">• <span className="ml-2">Landsat 8-9 Urban Heat Island Analysis</span></li>
              <li className="flex items-center">• <span className="ml-2">GPM IMERG Precipitation Data</span></li>
              <li className="flex items-center">• <span className="ml-2">MAIAC Aerosol Optical Depth</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Wins Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          icon="🌡"
          title="Avg. Heat Reduced"
          value={impactMetrics.heatReduction}
          unit="°C"
          change="↓ 18%"
          tooltip="Calculated from MODIS Land Surface Temperature data"
        />
        
        <MetricCard 
          icon="🌊"
          title="Flood Risk Reduced"
          value={impactMetrics.floodRiskReduction}
          unit="%"
          change="↓ 35%"
          tooltip="Based on GPM IMERG precipitation analysis"
        />
        
        <MetricCard 
          icon="💨"
          title="Air Quality Improved"
          value={impactMetrics.airQualityImprovement}
          unit="%"
          change="↑ 22%"
          tooltip="Derived from MAIAC Aerosol Optical Depth measurements"
        />
        
        <MetricCard 
          icon="🌳"
          title="Green Space Added"
          value={impactMetrics.greenSpaceAdded}
          unit=" acres"
          change="↑ 15%"
          tooltip="Calculated from Landsat NDVI vegetation index"
        />
      </div>

      {/* Ripple Map */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-cyan-500/30 shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-cyan-400">
          Project Impact Ripples Across the City
        </h2>
        <div className="h-96 rounded-lg overflow-hidden shadow-xl">
          <MapContainer
            center={[40.7128, -74.0060]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Add project markers */}
            {projectLocations.map(project => (
              <ProjectMarker key={project.id} project={project} />
            ))}
            
            {/* Add ripples for each project */}
            {projectLocations.map(project => (
              <Ripple 
                key={`ripple-${project.id}`} 
                center={[project.lat, project.lng]} 
                radius={800} 
                color="#10b981" 
                duration={4000} 
              />
            ))}
          </MapContainer>
        </div>
        <p className="text-center text-gray-400 mt-4">
          Click on any project to learn more about its impact
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm py-6 border-t border-gray-800/50">
        <p>ASTRA Urban Analytics Platform • Powered by NASA Earth Data</p>
        <p>Transforming cities through data-driven interventions</p>
      </div>

      <style jsx>{`
        .pulse-glow {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
          50% { text-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.6); }
          100% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
        }
        
        .particle {
          animation: float 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Impact;