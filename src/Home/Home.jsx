import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaChartLine,
} from "react-icons/fa";
import L from "leaflet";
import HeroSection from "../Home/HeroSection";
import PoweredByNASA from "../Home/PoweredByNASA";

const Home = ({ switchToModule }) => {
  const [activeMission, setActiveMission] = useState(null);
  const [metrics, setMetrics] = useState({
    heatExposure: 385_000_000,
    waterStress: 145_000_000,
    economicCost: 325_000_000_000,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Module images and descriptions
  const moduleImages = {
    Pulse: [
      "https://i.ibb.co/HD4L4KQf/Screenshot-2025-09-26-231655.png",
      "https://i.ibb.co/qYCcQqxB/Screenshot-2025-09-26-231727.png",
      "https://i.ibb.co/GQ3q2XQm/Screenshot-2025-09-26-233923.png",
       "https://i.ibb.co/LzVHzN6y/Screenshot-2025-09-26-231257.png",
      "https://i.ibb.co/QFKYLBWh/Screenshot-2025-09-26-231359.png",
    ],
    Atlas: [
      "https://i.ibb.co.com/21sK9zQj/Screenshot-2025-09-27-002211.pn",
"https://i.ibb.co.com/bjy96J6y/Screenshot-2025-09-27-002108.png",
"https://i.ibb.co.com/WvvQ0grX/Screenshot-2025-09-27-002151.pn",
"https://i.ibb.co.com/21sK9zQj/Screenshot-2025-09-27-002211.pn",
    ],
    Simulate: [
"https://i.ibb.co.com/tP3j0hZ7/Screenshot-2025-09-27-002018.png",
"https://i.ibb.co.com/kV0y1Fr9/Screenshot-2025-09-27-002054.png",
"https://i.ibb.co.com/bjy96J6y/Screenshot-2025-09-27-002108.png",
"https://i.ibb.co.com/5gtzFffG/Screenshot-2025-09-27-002119.png",
"https://i.ibb.co.com/qM3wVJsJ/Screenshot-2025-09-27-002131.png",
    ],
    Impact: [
"https://i.ibb.co.com/HJ69Tcb/Screenshot-2025-09-27-002454.png",
"https://i.ibb.co.com/4Rdqn2y4/Screenshot-2025-09-27-002505.pn",
"https://i.ibb.co.com/F41wDtRT/Screenshot-2025-09-27-002516.pn",
"https://i.ibb.co.com/1wd8443/Screenshot-2025-09-27-002529.png",
"https://i.ibb.co.com/Kptndhtj/Screenshot-2025-09-27-002541.pn",
    ],
    Engage: [
"https://i.ibb.co.com/s0mSc7z/Screenshot-2025-09-27-002417.png",
"https://i.ibb.co.com/Xry8LCZ6/Screenshot-2025-09-27-002429.pn",
"https://i.ibb.co.com/nqBFFRf5/Screenshot-2025-09-27-002440.pn",
    ],
  };

  const moduleDescriptions = [
    "Real-time monitoring of urban systems",
    "Interactive mapping of risk and vulnerability",
    "Test interventions and policy scenarios",
    "Measure outcomes and effectiveness",
    "Collaborate with stakeholders and communities",
  ];

  const currentModule = ["Pulse", "Atlas", "Simulate", "Impact", "Engage"][currentSlide];
  const images = moduleImages[currentModule];

  // Initialize Leaflet map
  useEffect(() => {
    let observer;
    let rerenderTimer;

    const initializeMap = () => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = L.map(mapRef.current).setView([23.8103, 90.4125], 3);

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "Tiles © Esri & contributors",
          }
        ).addTo(mapInstance.current);

        const cities = [
          { lat: 23.8103, lng: 90.4125, name: "Dhaka" },
          { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
          { lat: 28.6139, lng: 77.2090, name: "Delhi" },
          { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
          { lat: 13.0827, lng: 80.2707, name: "Chennai" },
        ];

        cities.forEach(city => {
          L.circleMarker([city.lat, city.lng], {
            radius: 8,
            color: "#ff6b6b",
            fillColor: "#ff6b6b",
            fillOpacity: 0.7,
            weight: 2,
          })
            .addTo(mapInstance.current)
            .bindPopup(`<b>${city.name}</b><br>Heat risk: High`);
        });

        // ResizeObserver to keep map responsive
        observer = new ResizeObserver(() => {
          mapInstance.current?.invalidateSize();
        });

        observer.observe(mapRef.current);
      }
    };

    // Initial map setup
    initializeMap();

    // Set timer to re-render map after 30 seconds
    rerenderTimer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      initializeMap();
    }, 30000);

    // Cleanup
    return () => {
      observer?.disconnect();
      clearTimeout(rerenderTimer);
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Module image carousel effect
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [currentSlide, images.length]);

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        heatExposure: prev.heatExposure + Math.floor(Math.random() * 1000) - 500,
        waterStress: prev.waterStress + Math.floor(Math.random() * 500) - 250,
        economicCost: prev.economicCost + Math.floor(Math.random() * 1_000_000) - 500_000,
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate module carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // NASA missions data
  const missions = [
    {
      id: "landsat",
      name: "Landsat",
      description: "Monitoring urban sprawl and green cover since 1972.",
      logo: "/placeholder-landsat.png",
      dataType: "Urban Development",
    },
    {
      id: "modis",
      name: "MODIS",
      description: "Tracking heat islands and temperature anomalies.",
      logo: "/placeholder-modis.png",
      dataType: "Thermal Data",
    },
    {
      id: "grace",
      name: "GRACE‑FO",
      description: "Measuring groundwater changes and mass transport.",
      logo: "/placeholder-grace.png",
      dataType: "Gravimetry",
    },
    {
      id: "viirs",
      name: "VIIRS",
      description: "Nighttime lights and energy consumption patterns.",
      logo: "/placeholder-viirs.png",
      dataType: "Night Lights",
    },
    {
      id: "firms",
      name: "FIRMS",
      description: "Real‑time active fire and thermal anomaly detection.",
      logo: "/placeholder-firms.png",
      dataType: "Fire Data",
    },
  ];

  // Helper function to format numbers with commas
  const formatNumber = (num) => num.toLocaleString("en-US");

  // Comparison Slider Component
  const CompareSlider = ({ itemOne, itemTwo }) => {
    return (
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">{itemOne}</div>
        <div className="flex-1">{itemTwo}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* Powered by NASA */}
      <section>
        <div className="p-1 m-2">
          <PoweredByNASA />
        </div>
      </section>

      {/* Mission Modal */}
      {activeMission && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{activeMission.name} Data</h3>
                <button
                  onClick={() => setActiveMission(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="h-64 bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
                {activeMission.id === "modis" ? (
                  <div className="text-center">
                    <div className="w-64 h-48 bg-gradient-to-r from-blue-400 via-red-400 to-orange-400 rounded-lg mb-4" />
                    <p>Urban Heat Island Visualization</p>
                  </div>
                ) : activeMission.id === "grace" ? (
                  <div className="text-center">
                    <div className="w-64 h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <FaChartLine className="text-4xl text-green-400" />
                    </div>
                    <p>Groundwater Depletion Timeline</p>
                  </div>
                ) : (
                  <p>Sample data visualization for {activeMission.name}</p>
                )}
              </div>

              <p className="text-gray-400 mb-6">
                This is a sample of the {activeMission.dataType} provided by{" "}
                {activeMission.name}. In the full application, you would be
                able to explore real‑time data streams and historical trends.
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveMission(null)}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASTRA Difference */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-300">
            The ASTRA Difference
          </h2>

          <CompareSlider
            itemOne={
              <div className="h-96 rounded-lg overflow-hidden relative border border-gray-600 from-purple-900 via-indigo-900 to-blue-900">
                <div ref={mapRef} className="absolute inset-0 z-10" />
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded text-sm uppercase tracking-wide z-10">
                  Traditional Satellite View
                </div>
              </div>
            }
            itemTwo={
              <div className="h-96 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-lg relative overflow-hidden border border-purple-500">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-20" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl text-white font-bold z-10 bg-black/50 px-4 py-2 rounded-lg">
                    ASTRA's Synaptic Network View
                  </p>
                </div>

                {/* Network visualization */}
                <div className="absolute inset-0">
                  <svg className="absolute inset-0 w-full h-full">
                    {Array.from({ length: 15 }).map((_, i) => {
                      const x1 = Math.random() * 100;
                      const y1 = Math.random() * 100;
                      const x2 = Math.random() * 100;
                      const y2 = Math.random() * 100;
                      
                      return (
                        <line
                          key={i}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="rgba(34, 211, 238, 0.5)"
                          strokeWidth="1"
                          className="animate-pulse"
                        />
                      );
                    })}
                  </svg>

                  {Array.from({ length: 20 }).map((_, i) => {
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const colors = ["bg-cyan-400", "bg-green-400", "bg-pink-400", "bg-yellow-400", "bg-purple-400"];
                    const color = colors[i % colors.length];
                    
                    return (
                      <div
                        key={i}
                        className={`absolute w-4 h-4 rounded-full animate-pulse ${color} shadow-[0_0_15px_currentColor]`}
                        style={{ top: `${top}%`, left: `${left}%` }}
                      />
                    );
                  })}

                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-[pulse_2s_infinite]"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.4}s`,
                          boxShadow: "0 0 10px 2px rgba(34, 211, 238, 0.7)"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/70 text-cyan-300 text-xs p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                    <span>Live data streams</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span>Environmental sensors</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                    <span>Urban infrastructure</span>
                  </div>
                </div>
              </div>
            }
          />

          <p className="text-center max-w-3xl mx-auto text-lg text-gray-300 mt-8">
            We transform pixels into understanding, revealing the pathways between environmental risk and human vulnerability.
          </p>
        </div>
      </section>

      {/* Live Global Dashboard */}
      <section className="py-16 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Live Global <span className="text-cyan-400">Dashboard</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">
              {formatNumber(metrics.heatExposure)}
            </div>
            <p className="text-gray-400">
              Global Urban Population Exposed to Extreme Heat
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {formatNumber(metrics.waterStress)}
            </div>
            <p className="text-gray-400">Coastal Cities Facing High Water Stress</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              ${formatNumber(metrics.economicCost)}
            </div>
            <p className="text-gray-400">
              Economic Cost of Urban Heat Islands (Today)
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8 max-w-3xl mx-auto">
          Data models based on NASA MODIS, GRACE, and SRTM data. Demo shows
          simulated live updates.
        </p>
      </section>

      {/* Module Preview Carousel */}
      <section className="py-16 px-4 md:px-8 bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explore ASTRA <span className="text-green-400">Modules</span>
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 gap-4 mb-4">
            {["Pulse", "Atlas", "Simulate", "Impact", "Engage"].map((module, index) => (
              <button
                key={module}
                className={`py-3 rounded-lg transition-colors ${
                  currentSlide === index ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => {
                  setCurrentSlide(index);
                  setImageIndex(0);
                }}
              >
                {module}
              </button>
            ))}
          </div>

          <div className="bg-black rounded-xl overflow-hidden h-96 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {images.length > 0 ? (
                  <img
                    src={images[imageIndex]}
                    alt={`${currentModule} preview`}
                    className="w-full h-full object-cover rounded-lg mb-6 mx-auto transition-opacity duration-700 ease-in-out"
                  />
                ) : (
                  <div className="w-72 h-48 bg-gray-800 rounded-lg mb-6 mx-auto flex items-center justify-center">
                    <FaPlay className="text-4xl text-green-400 opacity-70" />
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{currentModule}</h3>
                <p className="text-gray-400 max-w-md mx-auto">{moduleDescriptions[currentSlide]}</p>

                <button
                  onClick={() => switchToModule(currentModule.toLowerCase())}
                  className="mt-6 px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Explore Module
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action */}
      <section className="py-20 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black/70 z-0" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to see your city's future?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the mission to build resilient, sustainable, and equitable urban
            environments.
          </p>
          <button
            onClick={() => switchToModule("atlas")}
            className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
          >
            Launch ASTRA Command
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;