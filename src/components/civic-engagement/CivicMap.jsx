// src/components/civic-engagement/CivicMap/CivicMap.jsx
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, TreePine, Users, MessageCircle, MapPin } from 'lucide-react';

const CivicMap = ({
  activeProposal,
  viewMode,
  userLocation,
  nasaData,
  onProposalSelect,
  onLocationSelect
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [mapStyle, setMapStyle] = useState('https://demotiles.maplibre.org/style.json');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: userLocation || [-74.006, 40.7128], // Use user location or default to NYC
      zoom: 11,
      pitch: 45,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add heatmap layer for sentiment data
      map.current.addSource('sentiment-heatmap', {
        type: 'geojson',
        data: generateSentimentHeatmapData()
      });

      map.current.addLayer({
        id: 'sentiment-heat',
        type: 'heatmap',
        source: 'sentiment-heatmap',
        maxzoom: 15,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 0,
            6, 1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          'heatmap-opacity': 0.6
        }
      });

      // Add proposal markers
      addProposalMarkers();
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        markersRef.current.forEach(marker => marker.remove());
      }
    };
  }, [mapStyle]);

  // Update map when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
        zoom: 13,
        essential: true
      });
    }
  }, [userLocation]);

  // Update markers when active proposal changes
  useEffect(() => {
    if (map.current && activeProposal) {
      map.current.flyTo({
        center: activeProposal.coordinates,
        zoom: 15,
        essential: true
      });
    }
  }, [activeProposal]);

  const generateSentimentHeatmapData = () => ({
    type: 'FeatureCollection',
    features: Array.from({ length: 50 }, (_, i) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -74.006 + (Math.random() - 0.5) * 0.2,
          40.7128 + (Math.random() - 0.5) * 0.2
        ]
      },
      properties: {
        intensity: Math.random() * 5 + 1,
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative'
      }
    }))
  });

  const addProposalMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Sample proposals data
    const proposals = [
      {
        id: 1,
        type: 'heat',
        title: 'Cooling Corridor - Midtown',
        description: 'Install green infrastructure to reduce urban heat island effect',
        coordinates: [-74.006, 40.7549],
        urgency: 'high',
        supporters: 234,
        comments: 89,
        impact: 'Reduces temperature by 2-3°C'
      },
      {
        id: 2,
        type: 'flood',
        title: 'Drainage Upgrade - Downtown',
        description: 'Improve stormwater management system',
        coordinates: [-74.013, 40.7074],
        urgency: 'medium',
        supporters: 156,
        comments: 45,
        impact: 'Prevents flooding in 5-block radius'
      },
      {
        id: 3,
        type: 'green',
        title: 'Pocket Park - Upper East',
        description: 'Convert vacant lot into community green space',
        coordinates: [-73.959, 40.7734],
        urgency: 'low',
        supporters: 89,
        comments: 23,
        impact: 'Increases green space by 0.5 acres'
      }
    ];

    proposals.forEach(proposal => {
      // Create marker element
      const el = document.createElement('div');
      el.className = `proposal-marker ${proposal.type} ${proposal.urgency}`;
      el.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-200 cursor-pointer">
            ${getProposalIcon(proposal.type)}
            <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full ${getUrgencyColor(proposal.urgency)} border-2 border-white"></div>
          </div>
        </div>
      `;

      // Add click handler
      el.addEventListener('click', () => {
        onProposalSelect && onProposalSelect(proposal);
      });

      const marker = new maplibregl.Marker(el)
        .setLngLat(proposal.coordinates)
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-sm mb-1">${proposal.title}</h3>
                <p class="text-xs text-gray-600 mb-2">${proposal.description}</p>
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="flex items-center text-gray-500">
                    <Users class="w-3 h-3 mr-1"/>
                    ${proposal.supporters} supporters
                  </span>
                  <span class="flex items-center text-gray-500">
                    <MessageCircle class="w-3 h-3 mr-1"/>
                    ${proposal.comments} comments
                  </span>
                </div>
                <div class="text-xs text-green-600 font-medium">${proposal.impact}</div>
                <button class="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  };

  const getProposalIcon = (type) => {
    const icons = {
      heat: '🌡️',
      flood: '💧',
      green: '🌳'
    };
    return icons[type] || '📍';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[urgency] || 'bg-gray-500';
  };

  const handleMapClick = (e) => {
    if (onLocationSelect) {
      onLocationSelect({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      });
    }
  };

  // Add click event listener to map
  useEffect(() => {
    if (!map.current) return;

    map.current.on('click', handleMapClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [onLocationSelect]);

  const toggleMapLayer = (layerType) => {
    // Simple layer toggle - in real app, you'd switch between different map styles
    const newStyle = layerType === 'satellite' 
      ? 'https://api.maptiler.com/maps/satellite/style.json?key=YOUR_MAPTILER_KEY'
      : 'https://demotiles.maplibre.org/style.json';
    
    setMapStyle(newStyle);
  };

  // Add CSS for markers
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .proposal-marker.heat div div {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }
      .proposal-marker.flood div div {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }
      .proposal-marker.green div div {
        background: linear-gradient(135deg, #10b981, #059669);
      }
      .proposal-marker .maplibregl-popup {
        max-width: 300px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (viewMode === 'ar') {
    return <ARView activeProposal={activeProposal} />;
  }

  if (viewMode === '3d') {
    return <ThreeDView activeProposal={activeProposal} />;
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMapLayer('heat')}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          title="Heat Map"
        >
          <Thermometer className="w-5 h-5 text-red-500" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMapLayer('flood')}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          title="Flood Risk"
        >
          <Droplets className="w-5 h-5 text-blue-500" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMapLayer('green')}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          title="Green Spaces"
        >
          <TreePine className="w-5 h-5 text-green-500" />
        </motion.button>
      </div>

      {/* Location Marker */}
      {userLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="w-8 h-8 text-blue-500 drop-shadow-lg animate-bounce" />
        </div>
      )}

      {/* Environmental Alerts */}
      <div className="absolute top-4 right-4 max-w-sm space-y-2">
        {(nasaData?.alerts || []).map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border-l-4 border-red-500"
          >
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-sm">{alert.title}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <h4 className="font-semibold text-xs mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Urgency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Urgency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Urgency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ARView = ({ activeProposal }) => (
  <div className="h-full bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col items-center justify-center p-8">
    <div className="text-center text-white mb-8">
      <div className="text-6xl mb-4">📱</div>
      <h2 className="text-2xl font-bold mb-2">Augmented Reality View</h2>
      <p className="text-gray-300">Point your camera at a location to visualize proposals in AR</p>
    </div>
    
    <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-white/20">
      <h3 className="text-white font-semibold mb-2">AR Features</h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>• 3D proposal visualization</li>
        <li>• Real-time environmental data overlay</li>
        <li>• Interactive proposal preview</li>
        <li>• Community sentiment display</li>
      </ul>
    </div>

    {activeProposal && (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
      >
        <h3 className="font-semibold text-white">{activeProposal.title}</h3>
        <p className="text-gray-300 text-sm">AR overlay ready for visualization</p>
      </motion.div>
    )}
  </div>
);

const ThreeDView = ({ activeProposal }) => (
  <div className="h-full bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-8">
    <div className="text-center text-white mb-8">
      <div className="text-6xl mb-4">👓</div>
      <h2 className="text-2xl font-bold mb-2">3D Visualization Mode</h2>
      <p className="text-gray-300">Immersive 3D preview of urban proposals</p>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
        <div className="text-2xl mb-2">🏗️</div>
        <p className="text-white text-xs">Infrastructure</p>
      </div>
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
        <div className="text-2xl mb-2">🌳</div>
        <p className="text-white text-xs">Green Spaces</p>
      </div>
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
        <div className="text-2xl mb-2">💧</div>
        <p className="text-white text-xs">Water Systems</p>
      </div>
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
        <div className="text-2xl mb-2">🌡️</div>
        <p className="text-white text-xs">Heat Maps</p>
      </div>
    </div>

    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
      Launch 3D Viewer
    </button>
  </div>
);

export default CivicMap;