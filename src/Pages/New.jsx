import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiLayers, FiClock, FiPlay, FiPause, FiInfo, FiCornerUpLeft, FiDownload, FiBarChart2, FiX } from 'react-icons/fi';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// NASA mission logos (placeholder SVGs)
const missionLogos = {
  MODIS: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FF6B6B" stroke="#fff" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">MODIS</text>
    </svg>
  ),
  VIIRS: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#4ECDC4" stroke="#fff" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">VIIRS</text>
    </svg>
  ),
  Landsat: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#45B7D1" stroke="#fff" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8">LANDSAT</text>
    </svg>
  ),
  SRTM: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#96CEB4" stroke="#fff" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">SRTM</text>
    </svg>
  ),
  IMERG: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#5D5FEF" stroke="#fff" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">IMERG</text>
    </svg>
  ),
  default: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#718096" stroke="#fff" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8">DATA</text>
    </svg>
  )
};

// Demo data layers
const dataLayers = [
  {
    id: 'modis-lst',
    name: 'Land Surface Temperature',
    mission: 'MODIS',
    description: 'MODIS Land Surface Temperature shows how hot the surface of the Earth feels to the touch. This is different from air temperature.',
    colorRamp: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
    opacity: 0.7,
    visible: true,
    blendMode: 'normal',
    timeEnabled: true
  },
  {
    id: 'viirs-lights',
    name: 'Nighttime Lights',
    mission: 'VIIRS',
    description: 'VIIRS Nighttime Lights data shows human settlements and energy consumption patterns.',
    colorRamp: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#ffffff'],
    opacity: 0.7,
    visible: true,
    blendMode: 'normal',
    timeEnabled: true
  },
  {
    id: 'landsat-ndvi',
    name: 'Vegetation Index',
    mission: 'Landsat',
    description: 'Landsat NDVI measures vegetation health and density by comparing near-infrared and red light reflection.',
    colorRamp: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
    opacity: 0.7,
    visible: false,
    blendMode: 'normal',
    timeEnabled: true
  },
  {
    id: 'srtm-elevation',
    name: 'Elevation Data',
    mission: 'SRTM',
    description: 'SRTM provides high-resolution topographic data showing Earth\'s elevation patterns.',
    colorRamp: ['#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d73027'],
    opacity: 0.7,
    visible: false,
    blendMode: 'normal',
    timeEnabled: false
  },
  {
    id: 'imerg-precipitation',
    name: 'Precipitation',
    mission: 'IMERG',
    description: 'IMERG combines data from multiple satellites to provide global precipitation estimates.',
    colorRamp: ['#ffffff', '#c6e0ff', '#8cc2ff', '#4da6ff', '#1a85ff', '#0066ff', '#0047b3', '#002966', '#001433'],
    opacity: 0.7,
    visible: false,
    blendMode: 'normal',
    timeEnabled: true
  }
];

// Demo data for correlation
const correlationData = [
  { x: 25, y: 12000, z: 200 },
  { x: 28, y: 18000, z: 200 },
  { x: 30, y: 25000, z: 200 },
  { x: 32, y: 35000, z: 200 },
  { x: 35, y: 50000, z: 200 },
  { x: 38, y: 75000, z: 200 },
  { x: 40, y: 100000, z: 200 },
  { x: 42, y: 120000, z: 200 },
  { x: 22, y: 8000, z: 200 },
  { x: 26, y: 15000, z: 200 },
  { x: 29, y: 22000, z: 200 },
  { x: 33, y: 40000, z: 200 },
  { x: 36, y: 60000, z: 200 },
  { x: 39, y: 85000, z: 200 },
  { x: 41, y: 110000, z: 200 }
];

// Data stories
const dataStories = [
  {
    id: 'heat-poverty',
    title: 'The Heat-Poverty Link',
    position: [23.8103, 90.4125],
    description: 'This neighborhood has an average surface temperature of 40°C (104°F), 5°C hotter than the city average. NASA\'s VIIRS nighttime lights data also shows lower energy access, meaning fewer fans and AC units during heatwaves. This is a clear environmental justice issue.',
    sources: 'MODIS LST, VIIRS Night Lights, City Census Data',
    layers: ['modis-lst', 'viirs-lights']
  },
  {
    id: 'flood-risk',
    title: 'Flood Vulnerability',
    position: [23.8000, 90.4200],
    description: 'Low-lying areas with limited green infrastructure face significantly higher flood risks. SRTM elevation data combined with IMERG precipitation forecasts helps identify the most vulnerable communities.',
    sources: 'SRTM, IMERG, Social Vulnerability Index',
    layers: ['srtm-elevation', 'imerg-precipitation']
  },
  {
    id: 'urban-heat-island',
    title: 'Urban Heat Island Effect',
    position: [23.8150, 90.4050],
    description: 'Dense urban areas with limited vegetation can be up to 10°C hotter than surrounding rural areas. Landsat NDVI data clearly shows the correlation between vegetation loss and temperature increase.',
    sources: 'MODIS LST, Landsat NDVI',
    layers: ['modis-lst', 'landsat-ndvi']
  }
];

// Custom marker for data stories
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-data-marker',
    html: `<div class="pulse-marker"><div class="marker-inner"><i>i</i></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Layer card component
const LayerCard = ({ layer, onToggle, onOpacityChange, onBlendModeChange, onInfoClick }) => {
  // Use the mission logo or default if not found
  const MissionLogo = missionLogos[layer.mission] || missionLogos.default;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 transition-all hover:border-cyan-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MissionLogo />
          <h3 className="text-sm font-medium text-white">{layer.name}</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={() => onToggle(layer.id)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
        </label>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Opacity</span>
          <span>{Math.round(layer.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={layer.opacity}
          onChange={(e) => onOpacityChange(layer.id, parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Blend Mode</div>
        <select
          value={layer.blendMode}
          onChange={(e) => onBlendModeChange(layer.id, e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
        >
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="difference">Difference</option>
        </select>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex-1 h-3 rounded-full overflow-hidden bg-gray-700">
          {layer.colorRamp.map((color, i) => (
            <div
              key={i}
              className="inline-block h-full"
              style={{ width: `${100 / layer.colorRamp.length}%`, backgroundColor: color }}
            />
          ))}
        </div>
        <button
          onClick={() => onInfoClick(layer)}
          className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <FiInfo size={16} />
        </button>
      </div>
    </div>
  );
};

// Map controller component for handling layer changes
const MapController = ({ layers }) => {
  const map = useMap();
  
  useEffect(() => {
    // In a real implementation, this would update map layers based on the layer configuration
    console.log("Layers updated:", layers);
  }, [layers, map]);
  
  return null;
};

const New = () => {
  const [layers, setLayers] = useState(dataLayers);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [correlationX, setCorrelationX] = useState('modis-lst');
  const [correlationY, setCorrelationY] = useState('viirs-lights');
  const [showInfo, setShowInfo] = useState(null);
  const timeIntervalRef = useRef(null);

  // Handle layer toggle
  const handleToggleLayer = (layerId) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  // Handle opacity change
  const handleOpacityChange = (layerId, opacity) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  // Handle blend mode change
  const handleBlendModeChange = (layerId, blendMode) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, blendMode } : layer
    ));
  };

  // Handle time change
  const handleTimeChange = (value) => {
    setCurrentTime(value);
  };

  // Play/pause time animation
  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(timeIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      timeIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => (prev >= 100 ? 0 : prev + 1));
      }, 100);
    }
  };

  // Handle data story click
  const handleStoryClick = (story) => {
    setSelectedStory(story);
    
    // Activate the relevant layers
    setLayers(prev => prev.map(layer => ({
      ...layer,
      visible: story.layers.includes(layer.id)
    })));
  };

  // Handle create proposal
  const handleCreateProposal = () => {
    alert('Proposal creation would open with the current analysis data. This would connect to the CivicBlueprint module.');
  };

  // Handle info button click
  const handleInfoClick = (layer) => {
    setShowInfo(layer);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Layer Lens */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiLayers className="text-cyan-400" />
            <h2 className="text-lg font-semibold">Data Layer Controls</h2>
          </div>
          
          <div className="space-y-3 flex-1">
            {layers.map(layer => (
              <LayerCard
                key={layer.id}
                layer={layer}
                onToggle={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                onBlendModeChange={handleBlendModeChange}
                onInfoClick={handleInfoClick}
              />
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium mb-2">Blending Tips</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <span className="text-cyan-400">Multiply</span>: Darkens layers together</li>
              <li>• <span className="text-cyan-400">Screen</span>: Lightens layers together</li>
              <li>• <span className="text-cyan-400">Difference</span>: Highlights contrasts</li>
              <li>• <span className="text-cyan-400">Overlay</span>: Combines contrast with color</li>
            </ul>
          </div>
        </div>
        
        {/* Main map area */}
        <div className="flex-1 h-screen w-screen relative">
          <MapContainer
            center={[23.8103, 90.4125]}
    zoom={11}
    className="h-full w-full"
    zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            <MapController layers={layers} />
            
            {/* Data story markers */}
            {dataStories.map(story => (
              <Marker 
                key={story.id} 
                position={story.position} 
                icon={createCustomIcon()}
                eventHandlers={{
                  click: () => handleStoryClick(story)
                }}
              />
            ))}
          </MapContainer>
          
          {/* Map controls overlay */}
          <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiBarChart2 className="text-cyan-400" />
              <span className="text-sm font-medium">Active Layers</span>
            </div>
            <div className="space-y-1">
              {layers.filter(l => l.visible).map(layer => (
                <div key={layer.id} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: layer.colorRamp[5] }}
                  ></div>
                  <span>{layer.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time indicator */}
          <div className="absolute bottom-20 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium text-cyan-400 mb-1">Time Period</div>
            <div className="text-sm">
              {new Date(2023, Math.floor(currentTime / 8.33), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        
        {/* Right sidebar - Correlation tool */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiCornerUpLeft className="text-cyan-400" />
            <h2 className="text-lg font-semibold">Data Correlation</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">X-Axis Dataset</label>
            <select
              value={correlationX}
              onChange={(e) => setCorrelationX(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
            >
              {layers.map(layer => (
                <option key={layer.id} value={layer.id}>{layer.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Y-Axis Dataset</label>
            <select
              value={correlationY}
              onChange={(e) => setCorrelationY(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
            >
              {layers.map(layer => (
                <option key={layer.id} value={layer.id}>{layer.name}</option>
              ))}
            </select>
          </div>
          
          <div className="h-64 mb-4 bg-gray-700/30 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Temperature °C" 
                  stroke="#999"
                  label={{ value: "Surface Temperature", position: "insideBottom", offset: -5, fill: "#fff" }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Income" 
                  stroke="#999"
                  label={{ value: "Average Income", angle: -90, position: "insideLeft", offset: 10, fill: "#fff" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568', color: 'white' }}
                  formatter={(value, name) => [name === 'x' ? `${value}°C` : `$${value}`, name === 'x' ? 'Temperature' : 'Income']}
                />
                <Scatter name="Correlation" data={correlationData} fill="#8884d8">
                  {correlationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.x > 35 ? '#F56565' : entry.x > 30 ? '#ECC94B' : '#48BB78'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-xs text-gray-400 mb-6">
            <p>This scatter plot shows the correlation between surface temperature and average income across different neighborhoods. Each dot represents a neighborhood.</p>
          </div>
          
          <button
            onClick={handleCreateProposal}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-auto"
          >
            <FiDownload size={16} />
            Create Proposal from Analysis
          </button>
        </div>
      </div>
      
      {/* Bottom bar - Time Machine */}
      <div className="h-20 bg-gray-800 border-t border-gray-700 flex items-center px-6">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <FiClock className="text-cyan-400" />
            <span className="text-sm font-medium">Time Machine</span>
          </div>
          
          <div className="flex-1 mx-4">
            <input
              type="range"
              min="0"
              max="100"
              value={currentTime}
              onChange={(e) => handleTimeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Jan 2023</span>
              <span>Dec 2023</span>
            </div>
          </div>
          
          <button
            onClick={togglePlay}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10"
          >
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
          </button>
        </div>
      </div>
      
      {/* Data Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-600">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{selectedStory.title}</h2>
              <button 
                onClick={() => setSelectedStory(null)} 
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedStory.description}</p>
              
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-white mb-2">Data Sources</h3>
                <p className="text-sm text-gray-400">{selectedStory.sources}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Layer Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-600">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{showInfo.name}</h2>
              <button 
                onClick={() => setShowInfo(null)} 
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">{showInfo.description}</p>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-400">Color Scale</div>
                <div className="flex-1 h-4 rounded-full overflow-hidden ml-4 bg-gray-700">
                  {showInfo.colorRamp.map((color, i) => (
                    <div
                      key={i}
                      className="inline-block h-full"
                      style={{ width: `${100 / showInfo.colorRamp.length}%`, backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInfo(null)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #38bdf8;
          transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .slider::-moz-range-thumb:hover {
          background: #38bdf8;
          transform: scale(1.1);
        }
        
        .pulse-marker {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.3);
          animation: pulse 2s infinite;
        }
        
        .marker-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          color: white;
          font-style: normal;
          font-weight: bold;
          font-size: 12px;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default New;