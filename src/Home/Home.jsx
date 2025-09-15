// src/Home/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiArrowRight, FiGlobe } from 'react-icons/fi';

// Placeholder for 3D Globe
const CesiumGlobe = () => (
  <div className="w-full h-full bg-blue-900 rounded-lg flex items-center justify-center">
    <FiGlobe className="text-6xl text-cyan-400" />
    <p className="ml-4 text-cyan-200">Interactive 3D Globe with NASA Data Overlays</p>
  </div>
);

/** Mission Modal */
const MissionModal = ({ mission, isOpen, onClose }) => {
  if (!isOpen || !mission) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl">
        <h3 className="font-bold text-2xl">{mission.name} Data Sample</h3>
        <div className="py-4">
          {mission.type === 'heat' && (
            <div className="w-full h-64 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
              <p className="text-white font-semibold">Urban Heat Island Visualization</p>
            </div>
          )}
          {mission.type === 'water' && (
            <div className="w-full h-64 bg-gradient-to-t from-blue-100 to-blue-900 rounded-lg flex items-center justify-center">
              <div className="w-full bg-gray-800 p-4 rounded">
                <p className="text-white text-center mb-2">Groundwater Depletion Over Time</p>
                <div className="h-4 bg-red-600 rounded-full w-3/4 mx-auto"></div>
              </div>
            </div>
          )}
          {mission.type === 'sprawl' && (
            <div className="w-full h-64 bg-gradient-to-br from-green-500 to-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-white font-semibold">Urban Sprawl Analysis</p>
            </div>
          )}
          {!mission.type && (
            <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-800 rounded-lg flex items-center justify-center">
              <p className="text-white font-semibold">NASA Mission Data Visualization</p>
            </div>
          )}
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

/** Comparison Slider Placeholder */
const CompareSlider = ({ itemOne, itemTwo }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">{itemOne}</div>
      <div className="flex-1">{itemTwo}</div>
    </div>
  );
};

/** HomePage Component */
const HomePage = ({ switchToModule }) => {
  const [metrics, setMetrics] = useState({
    urbanHeat: 385600000,
    waterStress: 147000000,
    heatCost: 4520000000
  });
  const [activeMission, setActiveMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef(null);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        urbanHeat: prev.urbanHeat + Math.floor(Math.random() * 1000) - 500,
        waterStress: prev.waterStress + Math.floor(Math.random() * 500) - 250,
        heatCost: prev.heatCost + Math.floor(Math.random() * 100000) - 50000
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate carousel (placeholder)
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        console.log("Carousel would advance here");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const missions = [
    { id: 1, name: "Landsat", type: "sprawl", description: "Monitoring urban sprawl and green cover since 1972.", logo: "/placeholder-landsat.png" },
    { id: 2, name: "MODIS", type: "heat", description: "Tracking urban heat islands and thermal patterns.", logo: "/placeholder-modis.png" },
    { id: 3, name: "GRACE-FO", type: "water", description: "Measuring groundwater changes and mass transport.", logo: "/placeholder-grace.png" },
    { id: 4, name: "SUOMI NPP", description: "Nighttime lights data for economic activity assessment.", logo: "/placeholder-suomi.png" }
  ];

  const modules = [
    { id: 'pulse', name: 'Pulse', description: 'Real-time urban vitality monitoring' },
    { id: 'atlas', name: 'Atlas', description: 'Geospatial data exploration' },
    { id: 'simulate', name: 'Simulate', description: 'Scenario modeling and forecasting' },
    { id: 'impact', name: 'Impact', description: 'Resilience assessment tools' },
    { id: 'engage', name: 'Engage', description: 'Stakeholder collaboration platform' }
  ];

  const handleMissionClick = (mission) => {
    setActiveMission(mission);
    setIsModalOpen(true);
  };

  const formatNumber = (num) => num.toLocaleString('en-US');

  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CesiumGlobe />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center bg-black bg-opacity-50">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-cyan-400 drop-shadow-lg">ASTRA</h1>
          <p className="text-xl md:text-2xl mb-8 text-green-300 max-w-2xl">
            The Digital Nervous System for Earth's Cities
          </p>
          <p className="text-lg mb-12 text-blue-200">
            Powered by NASA Earth Observation Data
          </p>
          <button 
            onClick={() => switchToModule('dashboard')}
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-full text-xl font-semibold text-white glow-cyan"
          >
            Explore the Future of Urban Resilience
          </button>
        </div>
      </section>

      {/* NASA Missions Gallery */}
      <section className="py-20 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-300">
          Powered By NASA Data
        </h2>
        <div className="flex overflow-x-scroll pb-10 hide-scrollbar">
          <div className="flex space-x-8">
            {missions.map(mission => (
              <div key={mission.id} className="flex-shrink-0 w-72 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="h-16 mb-4 flex items-center">
                  <img src={mission.logo} alt={mission.name} className="h-12" />
                </div>
                <p className="text-lg font-semibold mb-2 text-green-300">{mission.name}</p>
                <p className="text-sm text-gray-300 mb-4">{mission.description}</p>
                <button 
                  onClick={() => handleMissionClick(mission)}
                  className="btn btn-outline btn-sm text-cyan-300 border-cyan-300 hover:bg-cyan-900"
                >
                  View Sample Data
                </button>
              </div>
            ))}
          </div>
        </div>
        <MissionModal mission={activeMission} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>

      {/* Comparison Slider */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-300">
            The ASTRA Difference
          </h2>
          <CompareSlider
            itemOne={
              <div className="h-96 bg-blue-900 rounded-lg flex items-center justify-center">
                <p className="text-2xl text-white">Traditional Satellite View</p>
              </div>
            }
            itemTwo={
              <div className="h-96 bg-purple-900 rounded-lg flex items-center justify-center relative">
                <p className="text-2xl text-white absolute inset-0 flex items-center justify-center">ASTRA's Synaptic Network View</p>
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 left-2/5 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            }
          />
          <p className="text-center max-w-3xl mx-auto text-lg text-gray-300 mt-8">
            We transform pixels into understanding, revealing the pathways between environmental risk and human vulnerability.
          </p>
        </div>
      </section>

      {/* Live Dashboard */}
      <section className="py-20 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-300">
          Live Global Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-5xl font-bold text-cyan-300 mb-2">{formatNumber(metrics.urbanHeat)}</div>
            <p className="text-gray-300">Global Urban Population Exposed to Extreme Heat</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-5xl font-bold text-pink-300 mb-2">{formatNumber(metrics.waterStress)}</div>
            <p className="text-gray-300">Coastal Cities Facing High Water Stress</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-5xl font-bold text-yellow-300 mb-2">${formatNumber(metrics.heatCost)}</div>
            <p className="text-gray-300">Economic Cost of Urban Heat Islands (Today)</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
          Data models based on NASA MODIS, GRACE, and SRTM data. Demo shows simulated live updates.
        </p>
      </section>

      {/* Module Carousel */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-300">
          Explore ASTRA Modules
        </h2>
        <div className="carousel w-full max-w-6xl mx-auto" ref={carouselRef}>
          {modules.map((module, index) => (
            <div key={module.id} id={`slide-${index}`} className="carousel-item relative w-full" onClick={() => switchToModule(module.id)}>
              <div className="w-full h-96 bg-blue-900 rounded-lg flex flex-col items-center justify-center cursor-pointer transform transition hover:scale-105">
                <div className="text-6xl mb-4 text-cyan-400"><FiPlay /></div>
                <h3 className="text-3xl font-bold mb-2">{module.name}</h3>
                <p className="text-gray-300">{module.description}</p>
                <button className="btn btn-ghost mt-4 text-cyan-300">Explore <FiArrowRight className="ml-2" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center w-full py-2 gap-2 mt-4">
          {modules.map((_, index) => <a key={index} href={`#slide-${index}`} className="btn btn-xs">{index + 1}</a>)}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready to see your city's future?</h2>
          <button onClick={() => switchToModule('dashboard')} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-full text-xl font-semibold text-white glow-cyan">
            Launch ASTRA Command
          </button>
        </div>
      </section>

      {/* Custom styles */}
      <style>{`
        .glow-cyan {
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
