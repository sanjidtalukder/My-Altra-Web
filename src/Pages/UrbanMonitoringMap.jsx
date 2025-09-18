import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const UrbanMonitoringMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Initialize the map only once
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([51.505, -0.09], 13);
      
      // Add OpenTopoMap tiles
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        subdomains: ['a','b','c']
      }).addTo(mapInstance.current);
      
      // Sample hazard data
      const hazards = [
        { id: 1, type: 'Structural', color: 'red', latlng: [51.505, -0.08], severity: 'High' },
        { id: 2, type: 'Water', color: 'blue', latlng: [51.51, -0.1], severity: 'Medium' },
        { id: 3, type: 'Environmental', color: 'yellow', latlng: [51.50, -0.12], severity: 'Low' }
      ];
      
      // Create hazard markers
      const markers = hazards.map(hazard => {
        const marker = L.marker(hazard.latlng, {
          icon: L.divIcon({
            html: `<div class="hazard-marker bg-${hazard.color}-500 text-white font-bold text-xs flex items-center justify-center">${hazard.type.charAt(0)}</div>`,
            iconSize: [32, 32],
            className: ''
          })
        }).addTo(mapInstance.current);
        
        // Add popup to marker
        marker.bindPopup(`
          <div class="text-gray-800">
            <h3 class="font-bold text-${hazard.color}-600">${hazard.type} Hazard</h3>
            <p>Severity: ${hazard.severity}</p>
          </div>
        `);
        
        return marker;
      });
      
      // Adjust map view to show all hazards
      const group = L.featureGroup(markers);
      mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup function to remove map on component unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-blue-500 border-opacity-20 shadow-2xl">
      <h2 className="text-xl font-semibold text-blue-200 mb-4">URBAN MONITORING MAP</h2>
      
      <div className="bg-gray-800 bg-opacity-50 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
        {/* Map container */}
        <div ref={mapRef} className="absolute inset-0 z-0"></div>
        
        {/* Simplified map representation (backdrop) */}
        <div className="map-backdrop">
          <div className="blue-blur"></div>
          <div className="green-blur"></div>
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10 z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className="absolute top-0 bottom-0 border border-gray-500" 
                style={{ left: `${i * 5}%`, width: '1px' }}
              ></div>
              <div 
                className="absolute left-0 right-0 border border-gray-500" 
                style={{ top: `${i * 5}%`, height: '1px' }}
              ></div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Connection lines */}
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="absolute w-1/4 h-px bg-red-500" style={{ top: '30%', left: '20%', transform: 'rotate(45deg)' }}></div>
          <div className="absolute w-1/4 h-px bg-blue-500" style={{ top: '40%', left: '45%', transform: 'rotate(30deg)' }}></div>
          <div className="absolute w-1/4 h-px bg-yellow-500" style={{ top: '50%', left: '70%', transform: 'rotate(60deg)' }}></div>
        </div>
        
        <div className="text-gray-400 text-center z-30 bg-gray-900 bg-opacity-70 p-4 rounded-lg backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-2">Interactive Urban Monitoring Map</p>
        </div>
      </div>
    </div>
  );
};

export default UrbanMonitoringMap;