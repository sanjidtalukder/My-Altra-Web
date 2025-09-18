import React, { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiUsers, FiMap, FiBarChart2, FiCpu, FiLayers, FiPlay, FiPause, FiArrowRight, FiArrowLeft, FiInfo, FiX } from 'react-icons/fi';

const Vision = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  // Phases data
  const phases = [
    {
      title: "The Spark",
      subtitle: "Hackathon MVP in Dhaka, Bangladesh",
      description: "Weaving the first synapse between satellite data and street action.",
      features: [
        { icon: <FiBarChart2 />, name: "StreetPulse", desc: "Real-time community feedback" },
        { icon: <FiLayers />, name: "OrbitView Swipe", desc: "Compare time periods" },
        { icon: <FiCpu />, name: "VeracityMissions", desc: "Data validation tasks" }
      ],
      data: "Powered by: NASA MODIS LST, NASA IMERG, NASA AOD",
      visualization: "spark"
    },
    {
      title: "City-Scale Deployment",
      subtitle: "The nervous system awakens across Dhaka",
      description: "The nervous system awakens. A city learns to feel its stress points.",
      stats: [
        { label: "City Wellbeing Index", value: "72%" },
        { label: "Citizen Missions Completed", value: "1,428" }
      ],
      data: "Powered by: NASA VIIRS Night Lights, Social Vulnerability Index",
      visualization: "city"
    },
    {
      title: "Predictive Intelligence",
      subtitle: "From reaction to prevention",
      description: "Healing the city before the fever breaks.",
      comparisons: [
        { label: "Forecasted Heatwave", value: "38°C", subtext: "Next week" },
        { label: "With Intervention", value: "32°C", subtext: "6°C reduction" }
      ],
      data: "Powered by: NASA NEX-GDDP, NASA IMERG, NASA MODIS",
      visualization: "predictive"
    },
    {
      title: "Regional Network",
      subtitle: "Cities are not islands",
      description: "Resilience is a network. Cities sharing data, alerts, and solutions.",
      alert: {
        title: "Regional Alert",
        message: "Drought detected in watershed. Conservation measures activated across region."
      },
      data: "Data sharing across 5 cities, 3.2M residents protected",
      visualization: "regional"
    },
    {
      title: "Planetary System",
      subtitle: "A digital twin for planetary health",
      description: "This is our future. A connected planet working in harmony.",
      missions: [
        { name: "Landsat", description: "Land cover monitoring since 1972", icon: "🛰️" },
        { name: "MODIS", description: "Thermal anomaly detection", icon: "🔥" },
        { name: "VIIRS", description: "Nighttime lights and energy data", icon: "💡" },
        { name: "GRACE-FO", description: "Gravity and water mass measurement", icon: "🌊" },
        { name: "SRTM", description: "Topographic elevation data", icon: "⛰️" },
        { name: "IMERG", description: "Global precipitation measurement", icon: "🌧️" }
      ],
      data: "Global satellite network integration complete",
      visualization: "planetary"
    }
  ];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isTransitioning) return;
      
      const scrollPosition = containerRef.current.scrollLeft;
      const containerWidth = containerRef.current.clientWidth;
      const phaseIndex = Math.floor(scrollPosition / containerWidth);
      
      if (phaseIndex !== currentPhase) {
        setCurrentPhase(phaseIndex);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPhase, isTransitioning]);

  // Auto-scroll through phases for demo
  useEffect(() => {
    if (!isPlaying || !containerRef.current) return;

    const interval = setInterval(() => {
      if (currentPhase < phases.length - 1) {
        goToPhase(currentPhase + 1);
      } else {
        setIsPlaying(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentPhase]);

  // Navigate to specific phase
  const goToPhase = (phaseIndex) => {
    setIsTransitioning(true);
    setCurrentPhase(phaseIndex);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: phaseIndex * containerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Visualizations for each phase
  const renderVisualization = (type) => {
    switch(type) {
      case "spark":
        return (
          <div className="relative w-64 h-64 mx-auto mb-8">
            <div className="absolute inset-0 bg-blue-800 rounded-full opacity-30 animate-pulse"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-ping">
              <FiMap className="text-white text-2xl" />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <FiMap className="text-white text-2xl" />
            </div>
            
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const radius = 100;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              
              return (
                <div
                  key={i}
                  className="absolute w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md transition-all duration-500 hover:scale-110 hover:bg-green-400"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  <FiUsers className="text-white" />
                </div>
              );
            })}

            <svg className="absolute inset-0 w-full h-full">
              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i / 5) * Math.PI * 2;
                const radius = 100;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                return (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${x}px)`}
                    y2={`calc(50% + ${y}px)`}
                    stroke="rgba(34, 211, 238, 0.5)"
                    strokeWidth="2"
                    className="animate-drawLine"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                );
              })}
            </svg>
          </div>
        );
      
      case "city":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8 bg-blue-900/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => {
                const vulnerability = Math.random();
                const pulse = Math.random() > 0.7;
                return (
                  <div
                    key={i}
                    className={`w-full h-8 rounded transition-all duration-300 hover:scale-110 ${pulse ? 'animate-pulse' : ''}`}
                    style={{
                      backgroundColor: `rgb(${255 * vulnerability}, ${255 * (1 - vulnerability)}, 0)`,
                      opacity: 0.7 + (vulnerability * 0.3)
                    }}
                    title={`Vulnerability: ${Math.round(vulnerability * 100)}%`}
                  />
                );
              })}
            </div>
            <div className="text-center mt-4 text-cyan-300 text-sm flex items-center justify-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              Urban vulnerability heatmap
            </div>
          </div>
        );
      
      case "predictive":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8">
            <div className="flex justify-between items-end h-40">
              <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                <div className="bg-red-500/70 w-12 rounded-t-lg shadow-md" style={{ height: '80%' }}></div>
                <div className="text-red-300 text-sm mt-2 font-bold">38°C</div>
                <div className="text-red-400 text-xs">Before</div>
              </div>
              <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                <div className="bg-green-500/70 w-12 rounded-t-lg shadow-md" style={{ height: '60%' }}></div>
                <div className="text-green-300 text-sm mt-2 font-bold">32°C</div>
                <div className="text-green-400 text-xs">After</div>
              </div>
            </div>
            <div className="text-cyan-300 text-center mt-4 text-sm flex items-center justify-center">
              <FiArrowRight className="mx-2 text-green-400" />
              Heat reduction through intervention
              <FiArrowLeft className="mx-2 text-red-400 transform rotate-180" />
            </div>
          </div>
        );
      
      case "regional":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8">
            <div className="flex justify-around items-center h-full">
              {['Dhaka', 'Delhi', 'Mumbai', 'Chennai', 'Karachi'].map((city, i) => (
                <div key={i} className="flex flex-col items-center transition-transform duration-300 hover:scale-110">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mb-2 shadow-md animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="text-white text-xs font-bold">{city[0]}</div>
                  </div>
                  <div className="text-cyan-300 text-xs">{city}</div>
                </div>
              ))}
            </div>
            <svg className="absolute inset-0 w-full h-full opacity-50">
              {[0, 1, 2, 3, 4].map((i) => {
                const nextIndex = (i + 1) % 5;
                return (
                  <line
                    key={i}
                    x1="20%"
                    y1="50%"
                    x2="35%"
                    y2="50%"
                    stroke="rgba(34, 211, 238, 0.5)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>
            <div className="text-cyan-300 text-center mt-4 text-sm">
              Connected cities network
            </div>
          </div>
        );
      
      case "planetary":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-lg flex items-center justify-center animate-pulse">
              <FiGlobe className="text-white text-4xl" />
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
              <div className="w-6 h-6 bg-yellow-400 rounded-full shadow-lg animate-bounce"></div>
            </div>
            <div className="text-cyan-300 text-center mt-4 text-sm">
              Global planetary monitoring system
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500 animate-pulse"
            style={{
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Help overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiInfo className="text-cyan-400" /> How to navigate
              </h3>
              <button 
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => setShowHelp(false)}
              >
                <FiX className="text-gray-400" />
              </button>
            </div>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Use the navigation buttons or dots to explore different phases</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Click the play button to automatically move through the journey</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Each phase shows a different aspect of our vision</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Hover over elements to see additional information</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Scroll horizontally if on a touch device</span>
              </li>
            </ul>
            <button 
              className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              onClick={() => setShowHelp(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 pt-8 px-8 flex justify-between items-center">
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-cyan-500/20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">ASTRA Vision</h1>
          <p className="text-cyan-300 text-sm">The evolution of urban resilience</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="p-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-700/50 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10"
            onClick={() => setShowHelp(true)}
            title="Show help"
          >
            <FiInfo size={20} />
          </button>
          <button 
            className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-md border border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Auto-play"}
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
            <span className="text-sm">{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 px-8 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-400 text-sm font-medium">Phase {currentPhase + 1} of {phases.length}</span>
          <span className="text-gray-400 text-sm">{Math.round((currentPhase / (phases.length - 1)) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-cyan-400/20"
            style={{ width: `${(currentPhase / (phases.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{phases[currentPhase].title}</span>
          <span>{currentPhase + 1}/{phases.length}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 py-8">
        {/* Navigation arrows */}
        {currentPhase > 0 && (
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-gray-700/50 hover:border-cyan-400/30 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/10"
            onClick={() => goToPhase(currentPhase - 1)}
            title="Previous phase"
            disabled={isTransitioning}
          >
            <FiArrowLeft size={24} />
          </button>
        )}
        
        {currentPhase < phases.length - 1 && (
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-gray-700/50 hover:border-cyan-400/30 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/10"
            onClick={() => goToPhase(currentPhase + 1)}
            title="Next phase"
            disabled={isTransitioning}
          >
            <FiArrowRight size={24} />
          </button>
        )}

        {/* Scrolling container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto h-full snap-x snap-mandatory scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {phases.map((phase, index) => (
            <section
              key={index}
              className="min-w-full h-full flex items-center justify-center snap-start p-4 md:p-8"
            >
              <div className="max-w-4xl w-full bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 transition-all duration-500 hover:shadow-cyan-500/20 hover:border-cyan-500/30">
                <div className="text-center mb-4">
                  <span className="text-cyan-400 font-semibold bg-cyan-900/30 px-3 py-1 rounded-full text-sm">Phase {index + 1}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">{phase.title}</h2>
                  <p className="text-lg text-cyan-200 mt-2">{phase.subtitle}</p>
                </div>

                {/* Visualization */}
                <div className="mb-6 transform transition-all duration-500 hover:scale-105">
                  {renderVisualization(phase.visualization)}
                </div>

                <div className="bg-gray-900/50 rounded-2xl p-6 mt-6 border border-gray-700/30 backdrop-blur-md">
                  <p className="text-lg text-cyan-100 text-center mb-6 italic">"{phase.description}"</p>
                  
                  {/* Features */}
                  {phase.features && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {phase.features.map((feature, i) => (
                        <div key={i} className="bg-gray-800/50 p-4 rounded-xl text-center transition-all duration-300 hover:bg-cyan-900/20 hover:scale-105 border border-gray-700/50 hover:border-cyan-400/30">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-xl mb-3 text-cyan-400 text-xl">
                            {feature.icon}
                          </div>
                          <h3 className="text-white font-semibold mb-1">{feature.name}</h3>
                          <p className="text-gray-300 text-sm">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Stats */}
                  {phase.stats && (
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-6">
                      {phase.stats.map((stat, i) => (
                        <div key={i} className="text-center bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:border-cyan-400/30">
                          <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                          <div className="text-gray-300 text-sm mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Comparisons */}
                  {phase.comparisons && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {phase.comparisons.map((comp, i) => (
                        <div key={i} className={`p-5 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                          i === 0 ? 'bg-red-900/30 border border-red-700/50 hover:border-red-400/30' : 'bg-green-900/30 border border-green-700/50 hover:border-green-400/30'
                        }`}>
                          <div className="text-sm text-gray-300 mb-1">{comp.label}</div>
                          <div className={`text-2xl font-bold ${i === 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {comp.value}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{comp.subtext}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Alert */}
                  {phase.alert && !Array.isArray(phase.alert) && (
                    <div className="mt-6 p-4 bg-amber-900/30 rounded-xl border border-amber-700/50 transition-all duration-300 hover:scale-[1.02]">
                      <div className="text-amber-300 font-semibold mb-2 flex items-center">
                        <FiInfo className="mr-2" /> {phase.alert.title}
                      </div>
                      <div className="text-amber-200 text-sm">{phase.alert.message}</div>
                    </div>
                  )}
                  
                  {/* Missions (for Planetary System phase) */}
                  {phase.missions && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-white text-center mb-4 bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">Satellite Network</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {phase.missions.map((mission, i) => (
                          <div key={i} className="bg-gray-800/50 p-4 rounded-xl text-center transition-all duration-300 hover:bg-cyan-900/20 hover:scale-105 border border-gray-700/50 hover:border-cyan-400/30">
                            <div className="text-2xl mb-2">{mission.icon}</div>
                            <h3 className="text-white font-semibold mb-1">{mission.name}</h3>
                            <p className="text-gray-300 text-sm">{mission.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Data source */}
                  {phase.data && (
                    <div className="mt-6 text-sm text-cyan-300/80 text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      {phase.data}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="relative z-10 pb-8 px-8 flex justify-center gap-3">
        {phases.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentPhase === index 
                ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/40' 
                : 'bg-white/30 hover:bg-cyan-500/50 hover:scale-110'
            }`}
            onClick={() => goToPhase(index)}
            title={`Go to Phase ${index + 1}: ${phases[index].title}`}
            disabled={isTransitioning}
          />
        ))}
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes drawLine {
          from {
            stroke-dasharray: 5, 5;
            stroke-dashoffset: 10;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-drawLine {
          animation: drawLine 1s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Vision;