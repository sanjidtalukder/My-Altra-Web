import React, { useState, useEffect } from 'react';
import './PulseFull.css';

const Firms = () => {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFire, setSelectedFire] = useState(null);

  useEffect(() => {
    const fetchFireData = async () => {
      try {
        setLoading(true);
        // Using a CORS proxy to avoid CORS issues with the API
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${'b8e0c8346641c9854785eba21a695605'}/MODIS_NRT/world/1`;
        
        const response = await fetch(proxyUrl + targetUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const lines = text.split('\n');
        
        // Parse CSV data
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          if (values.length === headers.length) {
            const entry = {};
            headers.forEach((header, index) => {
              entry[header.trim()] = values[index].trim();
            });
            return entry;
          }
          return null;
        }).filter(entry => entry !== null);
        
        setFireData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching fire data:', err);
      }
    };

    fetchFireData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="pulse-container">
        <div className="loading-spinner"></div>
        <p>Loading fire data from NASA FIRMS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pulse-container">
        <div className="error-message">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <p>Please check your API key or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pulse-container">
      <h1>NASA FIRMS Active Fire Data</h1>
      <p className="subtitle">Near real-time active fire data from MODIS satellites</p>
      
      <div className="content-wrapper">
        <div className="fire-list">
          <h2>Recent Fire Detections</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Brightness</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {fireData.slice(0, 20).map((fire, index) => (
                  <tr 
                    key={index} 
                    className={selectedFire === index ? 'selected' : ''}
                    onClick={() => setSelectedFire(index)}
                  >
                    <td>{fire.latitude || 'N/A'}</td>
                    <td>{fire.longitude || 'N/A'}</td>
                    <td>{fire.brightness || 'N/A'}</td>
                    <td>{formatDate(fire.acq_date)}</td>
                    <td>
                      <button 
                        className="details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFire(index);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="fire-details">
          <h2>Fire Details {selectedFire !== null ? `#${selectedFire + 1}` : ''}</h2>
          {selectedFire !== null ? (
            <div className="details-card">
              <div className="detail-row">
                <span className="label">Location:</span>
                <span className="value">
                  {fireData[selectedFire].latitude}, {fireData[selectedFire].longitude}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Brightness:</span>
                <span className="value">{fireData[selectedFire].brightness} Kelvin</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{formatDate(fireData[selectedFire].acq_date)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Satellite:</span>
                <span className="value">{fireData[selectedFire].satellite || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Confidence:</span>
                <span className="value">{fireData[selectedFire].confidence || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <p className="select-prompt">Select a fire detection from the list to view details</p>
          )}
          
          <div className="map-visualization">
            <h3>Global Fire Map</h3>
            <div className="map-placeholder">
              <p>Fire locations visualized on map</p>
              <div className="fire-points">
                {fireData.slice(0, 50).map((fire, index) => (
                  <div 
                    key={index}
                    className="fire-point"
                    style={{
                      left: `${((parseFloat(fire.longitude) + 180) / 360) * 100}%`,
                      top: `${((90 - parseFloat(fire.latitude)) / 180) * 100}%`,
                      opacity: selectedFire === index ? 1 : 0.6
                    }}
                    onClick={() => setSelectedFire(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Firms;