import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiLayers, FiClock, FiMessageSquare, FiAlertTriangle, FiCheckSquare, FiUser, FiMapPin, FiThumbsUp, FiCalendar, FiX, FiPlus, FiMinus, FiSearch, FiFilter, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { motion } from "framer-motion";


// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const citizenReportIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMDBENEYiIGZpbGwtb3BhY2l0eT0iMC43IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const proposalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZMNyAxMUwxMiA2TDE3IDExTDEyIDE2WiIgZmlsbD0iI0ZCNUEzQiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Demo data
const demoHeatData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'heat-1', severity: 0.87, name: 'Industrial District Heat Island', source: 'NASA MODIS LST' },
      geometry: { type: 'Polygon', coordinates: [[
        [90.4000, 23.8100],
        [90.4100, 23.8100],
        [90.4100, 23.8200],
        [90.4000, 23.8200],
        [90.4000, 23.8100]
      ]]}
    }
  ]
};

const demoFloodData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'flood-1', severity: 0.65, name: 'Riverbend Flood Zone', source: 'NASA GFMS' },
      geometry: { type: 'Polygon', coordinates: [[
        [90.4150, 23.8000],
        [90.4250, 23.8000],
        [90.4250, 23.8050],
        [90.4150, 23.8050],
        [90.4150, 23.8000]
      ]]}
    }
  ]
};

const demoCitizenReports = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { 
        id: 'report-1', 
        type: 'heat', 
        title: 'Extreme Heat in Playground', 
        description: 'The playground equipment gets too hot for children to use safely during afternoon hours.',
        user: 'Maria Rodriguez',
        timestamp: '2 hours ago',
        votes: 12,
        comments: 4
      },
      geometry: { type: 'Point', coordinates: [90.4050, 23.8120] }
    },
    {
      type: 'Feature',
      properties: { 
        id: 'report-2', 
        type: 'flood', 
        title: 'Street Flooding After Rain', 
        description: 'This intersection floods with even moderate rainfall, making it impassable.',
        user: 'James Wilson',
        timestamp: '5 hours ago',
        votes: 8,
        comments: 2
      },
      geometry: { type: 'Point', coordinates: [90.4200, 23.8020] }
    }
  ]
};

const demoProposals = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { 
        id: 'proposal-1', 
        title: 'Shade Structures for Playground', 
        description: 'Install shade sails and trees to reduce heat in the playground area.',
        status: 'draft',
        daysRemaining: 14,
        supportPercentage: 72,
        votes: 45,
        comments: 18
      },
      geometry: { type: 'Point', coordinates: [90.4050, 23.8120] }
    },
    {
      type: 'Feature',
      properties: { 
        id: 'proposal-2', 
        title: 'Improved Drainage System', 
        description: 'Upgrade drainage infrastructure to prevent flooding at this intersection.',
        status: 'approved',
        daysRemaining: 0,
        supportPercentage: 85,
        votes: 62,
        comments: 23
      },
      geometry: { type: 'Point', coordinates: [90.4200, 23.8020] }
    }
  ]
};

// Feed item component
const FeedItem = ({ item, onClick }) => {
  return (
    <div 
      className="p-4 bg-gray-800 rounded-lg mb-3 cursor-pointer hover:bg-gray-750 transition-all duration-200 hover:shadow-lg border border-gray-700"
      onClick={() => onClick(item)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 p-2 rounded-full bg-gray-700">
          {item.type === 'report' ? (
            <FiAlertTriangle className="text-cyan-400" size={16} />
          ) : item.type === 'proposal' ? (
            <FiCheckSquare className="text-amber-400" size={16} />
          ) : (
            <FiUser className="text-green-400" size={16} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">{item.user}</span>
            <span className="text-xs text-gray-400">{item.timestamp}</span>
          </div>
          <p className="text-sm text-gray-200">{item.message}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FiMapPin className="text-cyan-400" />
              {item.location}
            </span>
            {item.votes && (
              <span className="flex items-center gap-1">
                <FiThumbsUp className="text-green-400" />
                {item.votes} votes
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Proposal card component
const ProposalCard = ({ proposal, onClick }) => {
  return (
    <div 
      className="p-4 bg-gray-800 rounded-lg mb-3 cursor-pointer hover:bg-gray-750 transition-all duration-200 hover:shadow-lg border border-gray-700"
      onClick={() => onClick(proposal)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white">{proposal.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          proposal.status === 'draft' ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'
        }`}>
          {proposal.status}
        </span>
      </div>
      <p className="text-sm text-gray-300 mb-3">{proposal.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FiCalendar className="text-cyan-400" />
            {proposal.daysRemaining > 0 ? `${proposal.daysRemaining} days left` : 'Completed'}
          </span>
          <span className="flex items-center gap-1">
            <FiThumbsUp className="text-green-400" />
            {proposal.supportPercentage}% support
          </span>
        </div>
        <button className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
          Vote <FiArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

// Conversation bubble modal component
const ConversationBubble = ({ feature, onClose }) => {
  const [activeTab, setActiveTab] = useState('conversation');
  const [newComment, setNewComment] = useState('');
  
  // Mock comments data
  const comments = [
    { id: 1, user: 'City Planner', text: "We're looking into solutions for this issue.", timestamp: '2 hours ago' },
    { id: 2, user: 'Local Resident', text: "This has been a problem for years!", timestamp: '1 hour ago' },
    { id: 3, user: 'Community Organizer', text: "Let's schedule a meeting to discuss options.", timestamp: '30 minutes ago' },
  ];
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    // In a real app, this would submit the comment to an API
    setNewComment('');
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 bg-gray-850">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{feature.properties.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors">
              <FiX size={20} />
            </button>
          </div>
          <p className="text-gray-300 mt-2">{feature.properties.description}</p>
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
            <FiUser size={14} />
            <span>Reported by {feature.properties.user}</span>
            <span className="mx-1">•</span>
            <FiClock size={14} />
            <span>{feature.properties.timestamp}</span>
          </div>
        </div>
        
        <div className="flex border-b border-gray-700 bg-gray-850">
          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'conversation' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('conversation')}
          >
            <FiMessageSquare size={16} />
            Conversation
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'data' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('data')}
          >
            <FiLayers size={16} />
            Data & Context
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'log' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('log')}
          >
            <FiClock size={16} />
            Transparency Log
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-800 to-gray-900">
          {activeTab === 'conversation' && (
            <div>
              <div className="space-y-4 mb-6">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-cyan-400">{comment.user}</span>
                      <span className="text-xs text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-200">{comment.text}</p>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSubmitComment} className="border-t border-gray-700 pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                  className="w-full bg-gray-750 border border-gray-600 rounded-lg p-3 text-white resize-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Post Comment <FiArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Data Context</h3>
              <div className="bg-gray-750 rounded-lg p-4 mb-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertTriangle className="text-amber-400" />
                  <span className="font-medium text-white">NASA Data Source</span>
                </div>
                <p className="text-gray-300">
                  {feature.properties.type === 'heat' 
                    ? 'MODIS LST detected a heat anomaly here with temperatures 5.2°C above surrounding areas.' 
                    : 'GFMS flood models indicate this area has a 65% probability of flooding during seasonal rains.'}
                </p>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="text-green-400" />
                  <span className="font-medium text-white">Community Impact</span>
                </div>
                <p className="text-gray-300">
                  {feature.properties.type === 'heat' 
                    ? '12 residents have reported health concerns related to extreme heat in this area.' 
                    : 'Flooding here affects access to schools and healthcare facilities for approximately 500 residents.'}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'log' && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Transparency Log</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Issue Reported</div>
                    <div className="text-sm text-gray-400">3 days ago by Community Member</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-white">NASA Data Verified</div>
                    <div className="text-sm text-gray-400">2 days ago by City Planning Department</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Proposal Drafted</div>
                    <div className="text-sm text-gray-400">Today by Urban Planning Team</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Ripple effect component
const RippleEffect = ({ center, duration = 2000 }) => {
  const map = useMap();
  const rippleRef = useRef(null);
  
  useEffect(() => {
    if (!map || !center) return;

    const ripple = L.circle(center, {
      radius: 10,
      color: '#00D4FF',
      fillColor: '#00D4FF',
      fillOpacity: 0.3,
      weight: 2,
    }).addTo(map);

    rippleRef.current = ripple;

    // Animate the ripple
    let startTime = null;
    const maxRadius = 500; // meters
    
    function animateRipple(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const radius = 10 + progress * maxRadius;
      const opacity = 0.3 * (1 - progress);

      ripple.setRadius(radius);
      ripple.setStyle({ fillOpacity: opacity });

      if (progress < 1) {
        requestAnimationFrame(animateRipple);
      } else {
        if (map && map.removeLayer) map.removeLayer(ripple);
      }
    }

    requestAnimationFrame(animateRipple);

    return () => {
      if (rippleRef.current && map && map.removeLayer) {
        map.removeLayer(rippleRef.current);
        rippleRef.current = null;
      }
    };
  }, [center, duration, map]);
  
  return null;
};

// Custom control components
const ZoomControl = () => {
  const map = useMap();

  return (
    <div className="leaflet-control leaflet-bar bg-gray-800 border border-gray-600 rounded-md overflow-hidden">
      <button 
        className="p-2 hover:bg-gray-700 transition-colors text-white"
        onClick={() => map.zoomIn()}
      >
        <FiPlus size={16} />
      </button>
      <div className="border-t border-gray-600"></div>
      <button 
        className="p-2 hover:bg-gray-700 transition-colors text-white"
        onClick={() => map.zoomOut()}
      >
        <FiMinus size={16} />
      </button>
    </div>
  );
};

const Engage = () => {
  const [activeLayers, setActiveLayers] = useState({
    heat: true,
    flood: true,
    reports: true,
    proposals: true
  });
  const [timeFilter, setTimeFilter] = useState('24h');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [rippleCenter, setRippleCenter] = useState(null);
  const [feedItems, setFeedItems] = useState([
    {
      id: 1,
      type: 'report',
      user: 'Maria Rodriguez',
      message: 'reported extreme heat in the playground area',
      location: 'City Park',
      timestamp: '2 hours ago',
      votes: 12
    },
    {
      id: 2,
      type: 'proposal',
      user: 'City Planning Dept',
      message: 'proposed shade structures for playground',
      location: 'City Park',
      timestamp: '1 hour ago',
      votes: 8
    },
    {
      id: 3,
      type: 'action',
      user: 'James Wilson',
      message: 'voted in favor of improved drainage system',
      location: '5th & Main',
      timestamp: '45 minutes ago'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowConversation(true);
  };

  const handleFeedItemClick = (item) => {
    // In a real app, this would fly to the location on the map
    alert(`Navigating to ${item.location}`);
  };

  const handleProposalClick = (proposal) => {
    // In a real app, this would fly to the proposal location on the map
    alert(`Showing details for ${proposal.title}`);
  };

  const triggerRippleEffect = (latlng, message) => {
    setRippleCenter(latlng);
    
    // Add a new item to the feed
    setFeedItems(prev => [{
      id: Date.now(),
      type: 'action',
      user: 'System',
      message: message || 'Project approved!',
      location: 'Citywide',
      timestamp: 'Just now'
    }, ...prev]);
    
    // Clear the ripple center after a short delay
    setTimeout(() => setRippleCenter(null), 1000);
  };

  // Style functions for GeoJSON layers
  const heatStyle = (feature) => {
    const greenComponent = Math.round(100 - feature.properties.severity * 70);
    return {
      fillColor: `rgb(255, ${greenComponent}, 0)`,
      fillOpacity: 0.5,
      color: '#ff5c33',
      weight: 2,
      opacity: 0.7
    };
  };

  const floodStyle = (feature) => {
    const a = feature.properties.severity;
    return {
      fillColor: `rgba(51, 133, 255, ${a})`,
      fillOpacity: 0.5,
      color: '#3385ff',
      weight: 2,
      opacity: 0.7
    };
  };

  return (
   <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
  {/* Left Column - Map (70%) */}
  <div className="w-7/10 h-full z-10 relative">
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      {/* 3D Terrain Layer */}
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Dynamic Hazard Layers */}
      {activeLayers.heat && (
        <GeoJSON data={demoHeatData} style={heatStyle} onEachFeature={(f, l) =>
          l.bindPopup(`
            <div class="p-3 bg-gray-800/90 rounded-xl border border-gray-700 shadow-md">
              <h3 class="font-bold text-lg text-orange-400">${f.properties.name}</h3>
              <p class="my-2">Severity: ${Math.round(f.properties.severity * 100)}%</p>
              <p class="text-xs text-gray-400">Source: ${f.properties.source}</p>
            </div>
          `)} />
      )}

      {activeLayers.flood && (
        <GeoJSON data={demoFloodData} style={floodStyle} onEachFeature={(f, l) =>
          l.bindPopup(`
            <div class="p-3 bg-gray-800/90 rounded-xl border border-gray-700 shadow-md">
              <h3 class="font-bold text-lg text-blue-400">${f.properties.name}</h3>
              <p class="my-2">Severity: ${Math.round(f.properties.severity * 100)}%</p>
              <p class="text-xs text-gray-400">Source: ${f.properties.source}</p>
            </div>
          `)} />
      )}

      {/* Citizen Reports */}
      {activeLayers.reports && (
        <GeoJSON data={demoCitizenReports} pointToLayer={(f, latlng) =>
          L.marker(latlng, { icon: citizenReportIcon })
        } onEachFeature={(f, l) => {
          l.bindPopup(`
            <div class="p-3 bg-gray-800/95 rounded-xl border border-gray-700 shadow-lg max-w-xs">
              <h3 class="font-bold text-lg text-cyan-400">${f.properties.title}</h3>
              <p class="my-2">${f.properties.description}</p>
              <p class="text-sm text-gray-400">By ${f.properties.user}</p>
              <div class="flex justify-between mt-3 text-xs">
                <span class="text-cyan-400">${f.properties.votes} votes</span>
                <span class="text-gray-500">${f.properties.timestamp}</span>
              </div>
            </div>
          `);
          l.on("click", () => handleFeatureClick(f));
        }} />
      )}

      {/* Proposals */}
      {activeLayers.proposals && (
        <GeoJSON data={demoProposals} pointToLayer={(f, latlng) =>
          L.marker(latlng, { icon: proposalIcon })
        } onEachFeature={(f, l) => {
          l.bindPopup(`
            <div class="p-3 bg-gray-800/95 rounded-xl border border-gray-700 shadow-lg max-w-xs">
              <h3 class="font-bold text-lg text-amber-400">${f.properties.title}</h3>
              <p class="my-2">${f.properties.description}</p>
              <div class="flex justify-between mt-3">
                <span class="text-sm ${f.properties.status === "draft" ? "text-amber-400" : "text-green-400"}">
                  ${f.properties.status}
                </span>
                <span class="text-xs text-gray-400">${f.properties.supportPercentage}% support</span>
              </div>
            </div>
          `);
          l.on("click", () => handleFeatureClick(f));
        }} />
      )}

      {/* Ripple Effect */}
      {rippleCenter && <RippleEffect center={rippleCenter} />}
      <ZoomControl />
    </MapContainer>

    {/* Map Controls Overlay */}
    {/* Map controls overlay (always above map) */}
<div className="absolute top-4 left-4 z-[9999] bg-gray-800/90 backdrop-blur-md rounded-xl p-5 shadow-xl border border-gray-700 w-64">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-white flex items-center gap-2">
      <FiLayers className="text-cyan-400" />
      Data Layers
    </h3>
    <button 
      onClick={() => setShowFilters(!showFilters)} 
      className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
    >
      <FiFilter className="text-gray-400" size={16} />
    </button>
  </div>

  {showFilters && (
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500"
        />
        <FiSearch className="text-gray-400" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <FiClock className="text-cyan-400" />
        <span className="text-sm font-medium">Time Filter</span>
      </div>
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500"
      >
        <option value="24h">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
    </div>
  )}

  {/* Layer toggles */}
  <div className="space-y-2">
    {[
      { key: "heat", label: "Heat Risk (MODIS LST)" },
      { key: "flood", label: "Flood Risk (GFMS)" },
      { key: "reports", label: "Citizen Reports" },
      { key: "proposals", label: "Active Proposals" }
    ].map(layer => (
      <label 
        key={layer.key} 
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700/50 transition-colors"
      >
        <input
          type="checkbox"
          checked={activeLayers[layer.key]}
          onChange={() => toggleLayer(layer.key)}
          className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
        />
        <span className="text-sm">{layer.label}</span>
        {activeLayers[layer.key] ? (
          <FiEye className="text-cyan-400 ml-auto" />
        ) : (
          <FiEyeOff className="text-gray-500 ml-auto" />
        )}
      </label>
    ))}
  </div>
</div>


    {/* Ripple trigger button */}
    {/* Ripple Trigger Button */}
<motion.button
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  whileTap={{ scale: 0.92 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="absolute bottom-6 right-6 z-[2000] 
             bg-gradient-to-r from-cyan-500 to-blue-600 
             hover:from-cyan-600 hover:to-blue-700
             text-white font-semibold tracking-wide
             px-5 py-3 rounded-2xl shadow-lg
             flex items-center gap-2"
  onClick={() => triggerRippleEffect([23.8103, 90.4125], "New city initiative launched!")}
>
  {/* Glow Pulse Effect */}
  <span className="absolute inset-0 rounded-2xl bg-cyan-400/30 blur-lg animate-pulse -z-10"></span>

  {/* Icon Animation */}
  <motion.div
    animate={{ rotate: [0, 90, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <FiPlus size={20} />
  </motion.div>

  <span>Announce Initiative</span>
</motion.button>


  </div>

  {/* Right Column - Sidebar (30%) */}
  <div className="w-3/10 h-full bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 flex flex-col overflow-hidden">
    {/* Header */}
    <div className="p-4 border-b border-gray-700 bg-gray-800">
      <h1 className="text-xl font-bold text-white">Civic Engagement Hub</h1>
      <p className="text-sm text-gray-400">Connecting NASA data with community action</p>
    </div>

    {/* Tabs */}
    <div className="flex border-b border-gray-700 bg-gray-800">
      <button className="flex-1 py-3 text-sm font-medium text-cyan-400 border-b-2 border-cyan-400">
        <FiMessageSquare className="inline mr-2" />
        Activity Feed
      </button>
      <button className="flex-1 py-3 text-sm font-medium text-gray-400 hover:text-gray-300">
        <FiCheckSquare className="inline mr-2" />
        Proposals
      </button>
    </div>

    {/* Live Activity Feed */}
    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <FiMessageSquare className="text-cyan-400" />
          Live Activity Feed
        </h2>
        <span className="text-xs bg-cyan-600 px-2 py-1 rounded-full">42 NEW</span>
      </div>
      <div className="space-y-3">
        {feedItems.map(item => (
          <FeedItem key={item.id} item={item} onClick={handleFeedItemClick} />
        ))}
      </div>
    </div>

    {/* Active Proposals */}
    <div className="flex-1 overflow-y-auto p-4 border-t border-gray-700 bg-gray-850 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <FiCheckSquare className="text-amber-400" />
          Active Proposals
        </h2>
        <span className="text-xs bg-amber-600 px-2 py-1 rounded-full">2 ACTIVE</span>
      </div>
      <div className="space-y-3">
        {demoProposals.features.map(p => (
          <ProposalCard key={p.properties.id} proposal={p.properties} onClick={handleProposalClick} />
        ))}
      </div>
    </div>
  </div>

  {/* Conversation Modal */}
  {showConversation && selectedFeature && (
    <ConversationBubble feature={selectedFeature} onClose={() => setShowConversation(false)} />
  )}
</div>

  );
};

export default Engage;
