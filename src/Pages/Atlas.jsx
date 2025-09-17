import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import * as d3 from 'd3';
import { FiLayers, FiClock, FiEye, FiGlobe, FiAlertTriangle, FiHome, FiInfo, FiPlay, FiPause, FiZoomIn } from 'react-icons/fi';
import { hazardData, communityData, generateEdgeData } from './demoData';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom CSS classes for UI components
const styles = `
  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #2563eb;
  }
  
  .btn-glass {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .btn-glass:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .card {
    background-color: rgba(17, 24, 39, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .range {
    width: 100%;
    height: 0.5rem;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
  }
  
  .range::-webkit-slider-thumb {
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }
  
  .checkbox {
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .checkbox:checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }
  
  .label {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 0.25rem;
  }
  
  .label-text {
    margin-left: 0.5rem;
    font-size: 0.875rem;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .risk-pathway {
    position: relative;
    overflow: hidden;
  }

  .risk-pathway::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shine 2s infinite;
  }

  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  .glass-panel {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .hazard-tooltip {
    position: absolute;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 6px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1000;
    transform: translate(-50%, -100%);
    margin-top: -10px;
    white-space: nowrap;
  }

  .connection-line {
    stroke-dasharray: 5;
    animation: dash 30s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 1000;
    }
  }
`;

const Atlas = () => {
  const [map, setMap] = useState(null);
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
  const [edgeData, setEdgeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const d3Container = useRef(null);
  const simulationRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Generate edge data on component mount
  useEffect(() => {
    const edges = generateEdgeData(hazardData, communityData);
    setEdgeData(edges);
    setDataLoaded(true);
  }, []);

  // Effect for Equity Lens mode
  useEffect(() => {
    if (!map || !edgeData || !d3Container.current) return;

    if (equityLensActive) {
      // Dim the base map
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) layer.setOpacity(0.1);
      });

      // Hide standard layers (they'll be replaced with D3 visualization)
      const container = map.getContainer();
      const leafletOverlay = container.querySelector('.leaflet-overlay-pane');
      if (leafletOverlay) leafletOverlay.style.opacity = 0;

      // Set up D3 force-directed graph
      initForceDirectedGraph();
    } else {
      // Restore standard view
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) layer.setOpacity(1);
      });

      const container = map.getContainer();
      const leafletOverlay = container.querySelector('.leaflet-overlay-pane');
      if (leafletOverlay) leafletOverlay.style.opacity = 1;

      // Clean up D3 simulation
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
      
      const svg = d3.select(d3Container.current).select('svg');
      if (!svg.empty()) {
        svg.selectAll('*').remove();
      }
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [equityLensActive, map, edgeData, visibleLayers]);

  // Initialize force-directed graph
  const initForceDirectedGraph = () => {
    if (!edgeData || !d3Container.current) return;

    // Clear any existing SVG
    d3.select(d3Container.current).selectAll('svg').remove();

    // Prepare nodes and links for D3
    const nodes = [];
    const nodeMap = new Map();
    
    // Add hazard nodes
    hazardData.features.forEach(feature => {
      if (visibleLayers[feature.properties.type]) {
        const node = {
          id: feature.properties.id,
          type: 'hazard',
          properties: feature.properties,
          x: feature.geometry.coordinates[0],
          y: feature.geometry.coordinates[1]
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
      }
    });
    
    // Add community nodes
    communityData.features.forEach(feature => {
      if (visibleLayers.communities) {
        const node = {
          id: feature.properties.id,
          type: 'community',
          properties: feature.properties,
          x: feature.geometry.coordinates[0],
          y: feature.geometry.coordinates[1]
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
      }
    });
    
    // Add links
    const links = [];
    edgeData.features.forEach(feature => {
      const sourceNode = nodeMap.get(feature.properties.source);
      const targetNode = nodeMap.get(feature.properties.target);
      
      if (sourceNode && targetNode && visibleLayers[sourceNode.properties.type] && visibleLayers.connections) {
        links.push({
          source: sourceNode,
          target: targetNode,
          weight: feature.properties.weight,
          type: sourceNode.properties.type,
          properties: feature.properties
        });
      }
    });

    // Set up SVG container
    const mapContainer = map.getContainer();
    const { width, height } = mapContainer.getBoundingClientRect();
    
    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('z-index', 500)
      .style('pointer-events', 'none');
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('link', d3.forceLink(links).id(d => d.id).distance(50).strength(d => d.weight))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    simulationRef.current = simulation;
    
    // Add arrowhead markers for links
    const defs = svg.append('defs');
    ['heat', 'flood', 'fire', 'air'].forEach(type => {
      defs.append('marker')
        .attr('id', `arrowhead-${type}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', getHazardColor(type));
    });
    
    // Draw links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => getHazardColor(d.type))
      .attr('stroke-width', d => d.weight * 3)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', d => `url(#arrowhead-${d.type})`)
      .attr('class', 'connection-line');
    
    // Draw nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => d.type === 'hazard' ? 
        (d.properties.severity * 10 + 5) : 
        (d.properties.population / 10000 + 3))
      .attr('fill', d => d.type === 'hazard' ? 
        getHazardColor(d.properties.type) : 
        getVulnerabilityColor(d.properties.vulnerabilityIndex))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));
    
    // Add node labels
    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.properties.name || d.properties.type)
      .attr('font-size', '10px')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', '#fff')
      .attr('text-shadow', '0 1px 2px rgba(0,0,0,0.5)');
    
    // Add link interaction
    link
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedConnection(d);
      });
    
    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
    
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  // Get color based on hazard type
  const getHazardColor = (type) => {
    switch (type) {
      case 'heat': return '#ff5c33';
      case 'flood': return '#3385ff';
      case 'fire': return '#ff3333';
      case 'air': return '#cccccc';
      default: return '#999999';
    }
  };

  // Get color based on vulnerability index
  const getVulnerabilityColor = (index) => {
    // Interpolate from green (low vulnerability) to red (high vulnerability)
    const r = Math.floor(255 * index);
    const g = Math.floor(255 * (1 - index));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Style for hazard GeoJSON layer
  const hazardStyle = (feature) => {
    return {
      radius: feature.properties.severity * 15 + 5,
      fillColor: getHazardColor(feature.properties.type),
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    };
  };

  // Style for community GeoJSON layer
  const communityStyle = (feature) => {
    return {
      radius: Math.min(feature.properties.population / 5000, 20),
      fillColor: getVulnerabilityColor(feature.properties.vulnerabilityIndex),
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    };
  };

  // Style for edge GeoJSON layer
  const edgeStyle = (feature) => {
    return {
      color: getHazardColor(feature.properties.type),
      weight: feature.properties.weight * 8,
      opacity: 0.6,
      dashArray: '10, 10'
    };
  };

  // Handle click on hazard point
  const onHazardClick = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.type.toUpperCase()} Hazard</h3>
        <p>Severity: ${(feature.properties.severity * 100).toFixed(0)}%</p>
        <p>Date: ${new Date(feature.properties.timestamp).toLocaleDateString()}</p>
      </div>
    `);
  };

  // Handle click on community point
  const onCommunityClick = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.name}</h3>
        <p>Vulnerability: ${(feature.properties.vulnerabilityIndex * 100).toFixed(0)}%</p>
        <p>Population: ${feature.properties.population.toLocaleString()}</p>
      </div>
    `);
  };

  // Handle click on edge
  const onEdgeClick = (feature, layer) => {
    const hazard = hazardData.features.find(f => f.properties.id === feature.properties.source);
    const community = communityData.features.find(f => f.properties.id === feature.properties.target);
    
    if (hazard && community) {
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">Risk Pathway</h3>
          <p>${hazard.properties.type.toUpperCase()} risk from ${hazard.properties.name} 
          is impacting ${community.properties.population.toLocaleString()} 
          people in ${community.properties.name}</p>
          <p>Risk Score: ${(feature.properties.weight * 100).toFixed(0)}%</p>
        </div>
      `);
    }
  };

  // Toggle layer visibility
  const toggleLayer = (layerName) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  // Filter data based on time period
  const filterDataByTime = (data, timePeriod) => {
    // Handle case where data is undefined or null
    if (!data || !data.features) {
      return { features: [] };
    }
    
    if (timePeriod === 'all') return data;
    
    const now = new Date();
    let startDate;
    
    switch(timePeriod) {
      case 'past':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'present':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'future':
        // For demo purposes, future is just a subset
        return {
          ...data,
          features: data.features.slice(0, Math.floor(data.features.length / 2))
        };
      default:
        return data;
    }
    
    return {
      ...data,
      features: data.features.filter(f => 
        f.properties && f.properties.timestamp && new Date(f.properties.timestamp) >= startDate
      )
    };
  };

  // Handle play/pause for simulation
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start simulation
      playIntervalRef.current = setInterval(() => {
        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0.1).restart();
        }
      }, 1000 / simulationSpeed);
    } else {
      // Pause simulation
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      if (simulationRef.current) {
        simulationRef.current.alphaTarget(0);
      }
    }
  };

  // Handle simulation speed change
  const handleSpeedChange = (speed) => {
    setSimulationSpeed(speed);
    if (isPlaying && playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = setInterval(() => {
        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0.1).restart();
        }
      }, 1000 / speed);
    }
  };

  // Zoom to fit all data
  const zoomToData = () => {
    if (map) {
      const allFeatures = [
        ...hazardData.features,
        ...communityData.features
      ];
      
      const group = L.featureGroup(
        allFeatures.map(f => {
          if (f.geometry.type === 'Point') {
            return L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]]);
          }
          return L.geoJSON(f);
        })
      );
      
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Add style tag for custom CSS */}
      <style>{styles}</style>
      
      {/* Map Container */}
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Hazard Data Layer */}
        {hazardData && visibleLayers && (
          <GeoJSON
            key={`hazards-${timePeriod}-${JSON.stringify(visibleLayers)}`}
            data={filterDataByTime(hazardData, timePeriod)}
            pointToLayer={(feature, latlng) => {
              const style = hazardStyle(feature);
              return L.circleMarker(latlng, style);
            }}
            onEachFeature={(feature, layer) => onHazardClick(feature, layer)}
            style={() => ({})}
          />
        )}
        
        {/* Community Data Layer */}
        {communityData && visibleLayers.communities && (
          <GeoJSON
            key={`communities-${timePeriod}`}
            data={filterDataByTime(communityData, timePeriod)}
            pointToLayer={(feature, latlng) => {
              const style = communityStyle(feature);
              return L.circleMarker(latlng, style);
            }}
            onEachFeature={(feature, layer) => onCommunityClick(feature, layer)}
            style={() => ({})}
          />
        )}
        
        {/* Edge Data Layer */}
        {edgeData && visibleLayers.connections && (
          <GeoJSON
            key={`edges-${timePeriod}-${JSON.stringify(visibleLayers)}`}
            data={filterDataByTime(edgeData, timePeriod)}
            style={edgeStyle}
            onEachFeature={(feature, layer) => onEdgeClick(feature, layer)}
          />
        )}
      </MapContainer>
      
      {/* D3 Container for Equity Lens */}
      <div ref={d3Container} className="absolute inset-0 pointer-events-none z-500" />
      
      {/* UI Controls */}
      <div className="absolute top-4 right-4 z-1000 flex flex-col gap-3">
        {/* Equity Lens Toggle */}
        <button
          className={`btn ${equityLensActive ? 'btn-primary' : 'btn-glass'} rounded-full shadow-lg pulse`}
          onClick={() => setEquityLensActive(!equityLensActive)}
        >
          <FiEye className="mr-2" />
          {equityLensActive ? 'Map View' : 'Equity Lens'}
        </button>
        
        {/* Time Travel Slider */}
        <div className="card glass-panel rounded-box p-4 w-64 fade-in">
          <div className="flex items-center mb-2">
            <FiClock className="mr-2" />
            <span className="font-bold">Time Travel</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>Past</span>
            <span>Present</span>
            <span>Future</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            value={['past', 'present', 'future'].indexOf(timePeriod)}
            onChange={(e) => setTimePeriod(['past', 'present', 'future'][e.target.value])}
            className="range range-xs"
          />
        </div>
        
        {/* Layer Controls */}
        <div className="card glass-panel rounded-box p-4 w-64 fade-in">
          <div className="flex items-center mb-2">
            <FiLayers className="mr-2" />
            <span className="font-bold">Layers</span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer label justify-start">
              <input
                type="checkbox"
                checked={visibleLayers.heat}
                onChange={() => toggleLayer('heat')}
                className="checkbox checkbox-xs mr-2"
              />
              <FiAlertTriangle className="text-orange-500 mr-1" />
              <span className="label-text">Heat Hazards</span>
            </label>
            <label className="cursor-pointer label justify-start">
              <input
                type="checkbox"
                checked={visibleLayers.flood}
                onChange={() => toggleLayer('flood')}
                className="checkbox checkbox-xs mr-2"
              />
              <FiAlertTriangle className="text-blue-500 mr-1" />
              <span className="label-text">Flood Hazards</span>
            </label>
            <label className="cursor-pointer label justify-start">
              <input
                type="checkbox"
                checked={visibleLayers.fire}
                onChange={() => toggleLayer('fire')}
                className="checkbox checkbox-xs mr-2"
              />
              <FiAlertTriangle className="text-red-500 mr-1" />
              <span className="label-text">Fire Hazards</span>
            </label>
            <label className="cursor-pointer label justify-start">
              <input
                type="checkbox"
                checked={visibleLayers.air}
                onChange={() => toggleLayer('air')}
                className="checkbox checkbox-xs mr-2"
              />
              <FiAlertTriangle className="text-gray-400 mr-1" />
              <span className="label-text">Air Hazards</span>
            </label>
            <label className="cursor-pointer label justify-start">
              <input
                type="checkbox"
                checked={visibleLayers.communities}
                onChange={() => toggleLayer('communities')}
                className="checkbox checkbox-xs mr-2"
              />
              <FiHome className="text-green-500 mr-1" />
              <span className="label-text">Communities</span>
            </label>
            <label className="cursor-pointer label justify-start">
              <input
                type="checkbox"
                checked={visibleLayers.connections}
                onChange={() => toggleLayer('connections')}
                className="checkbox checkbox-xs mr-2"
              />
              <FiGlobe className="text-purple-500 mr-1" />
              <span className="label-text">Connections</span>
            </label>
          </div>
        </div>

        {/* Simulation Controls */}
        {equityLensActive && (
          <div className="card glass-panel rounded-box p-4 w-64 fade-in">
            <div className="flex items-center mb-2">
              <FiPlay className="mr-2" />
              <span className="font-bold">Simulation</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <button 
                className={`btn ${isPlaying ? 'btn-primary' : 'btn-glass'} btn-sm`}
                onClick={togglePlayPause}
              >
                {isPlaying ? <FiPause /> : <FiPlay />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <div className="flex gap-1">
                {[0.5, 1, 2].map(speed => (
                  <button
                    key={speed}
                    className={`btn btn-sm ${simulationSpeed === speed ? 'btn-primary' : 'btn-glass'}`}
                    onClick={() => handleSpeedChange(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
            <button 
              className="btn btn-glass btn-sm w-full"
              onClick={zoomToData}
            >
              <FiZoomIn className="mr-1" />
              Zoom to Data
            </button>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-1000 card glass-panel rounded-box p-4 w-56 fade-in">
        <div className="flex items-center mb-2">
          <FiGlobe className="mr-2" />
          <span className="font-bold">Legend</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm">Heat Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Flood Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Fire Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
            <span className="text-sm">Air Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-red-500 mr-2"></div>
            <span className="text-sm">Community Vulnerability</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedNode && (
        <div className="absolute top-4 left-4 z-1000 card glass-panel rounded-box p-4 w-80 fade-in risk-pathway">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">
              {selectedNode.type === 'hazard' ? 'Hazard Details' : 'Community Details'}
            </h3>
            <button onClick={() => setSelectedNode(null)} className="text-lg">×</button>
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
        </div>
      )}

      {selectedConnection && (
        <div className="absolute top-4 left-4 z-1000 card glass-panel rounded-box p-4 w-80 fade-in risk-pathway">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Risk Pathway</h3>
            <button onClick={() => setSelectedConnection(null)} className="text-lg">×</button>
          </div>
          <p className="text-sm"><strong>From:</strong> {selectedConnection.source.properties.name}</p>
          <p className="text-sm"><strong>To:</strong> {selectedConnection.target.properties.name}</p>
          <p className="text-sm"><strong>Risk Level:</strong> {Math.round(selectedConnection.weight * 100)}%</p>
          <p className="text-sm"><strong>Type:</strong> {selectedConnection.type}</p>
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 z-2000 bg-black bg-opacity-70 flex items-center justify-center fade-in">
          <div className="card glass-panel rounded-box p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Welcome to the Urban Resilience Explorer</h2>
            <div className="space-y-3 mb-6">
              <p className="text-sm">This interactive map visualizes environmental hazards and their impact on vulnerable communities.</p>
              <p className="text-sm">• Use the <strong>Equity Lens</strong> to see connections between hazards and communities</p>
              <p className="text-sm">• Toggle different <strong>layers</strong> to focus on specific data</p>
              <p className="text-sm">• Use the <strong>time slider</strong> to explore past, present, and future scenarios</p>
              <p className="text-sm">• Click on any element to see detailed information</p>
            </div>
            <button 
              className="btn btn-primary w-full"
              onClick={() => setShowTutorial(false)}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Help Button */}
      <button
        className="absolute bottom-4 right-4 z-1000 btn btn-glass rounded-full w-12 h-12 flex items-center justify-center"
        onClick={() => setShowTutorial(true)}
      >
        <FiInfo className="text-xl" />
      </button>

      {/* Status Bar */}
      {dataLoaded && (
        <div className="absolute bottom-0 left-0 right-0 z-1000 bg-black bg-opacity-70 text-white text-xs p-2 flex justify-between">
          <div>
            {equityLensActive ? 'Equity Lens Active' : 'Standard Map View'} | 
            {timePeriod === 'past' ? ' Viewing Past Data' : 
            timePeriod === 'present' ? ' Viewing Current Data' : ' Viewing Future Projections'}
          </div>
          <div>
            {hazardData?.features?.length || 0} Hazards | {communityData?.features?.length || 0} Communities | {edgeData?.features?.length || 0} Connections
          </div>
        </div>
      )}
    </div>
  );
};

export default Atlas;