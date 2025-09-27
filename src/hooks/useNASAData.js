// src/hooks/useNASAData.js
import { useState, useEffect } from 'react';

export const useNASAData = () => {
  const [nasaData, setNasaData] = useState(null);
  const [environmentalAlerts, setEnvironmentalAlerts] = useState([]);

  useEffect(() => {
    // Simulate NASA data fetching
    const fetchNASAData = async () => {
      // Mock data - in real implementation, this would connect to NASA APIs
      const mockData = {
        modisLST: 35.6, // Land Surface Temperature
        landsatNDVI: 0.45, // Vegetation Index
        floodRisk: 0.7,
        airQuality: 65,
        alerts: [
          {
            id: 1,
            type: 'heat',
            title: 'Heat Emergency Alert',
            description: 'MODIS shows 5°C above normal temperatures',
            threshold: 35,
            current: 38.2
          }
        ]
      };

      setNasaData(mockData);
      
      // Generate alerts based on thresholds
      const alerts = [];
      if (mockData.modisLST > 35) {
        alerts.push({
          id: 1,
          type: 'heat',
          message: `Heat anomaly detected: ${mockData.modisLST}°C`,
          severity: 'high'
        });
      }
      if (mockData.floodRisk > 0.6) {
        alerts.push({
          id: 2,
          type: 'flood',
          message: `High flood risk: ${Math.round(mockData.floodRisk * 100)}%`,
          severity: 'medium'
        });
      }

      setEnvironmentalAlerts(alerts);
    };

    fetchNASAData();
    const interval = setInterval(fetchNASAData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { nasaData, environmentalAlerts };
};
