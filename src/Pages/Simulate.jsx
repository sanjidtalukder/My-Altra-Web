import React, { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiUsers, FiMap, FiBarChart2, FiCpu, FiLayers, FiPlay, FiPause, FiChevronRight, FiChevronLeft, FiHelpCircle } from 'react-icons/fi';

const Simulate = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
      visualization: "planetary"
    }
  ];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
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
  }, [currentPhase]);

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
    setCurrentPhase(phaseIndex);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: phaseIndex * containerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
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
            <div className="absolute inset-0 bg-blue-800 rounded-full opacity-30"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
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
                  className="absolute w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.2}s`
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
                  />
                );
              })}
            </svg>
          </div>
        );
      
      case "city":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8 bg-blue-900/20 rounded-xl p-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => {
                const vulnerability = Math.random();
                return (
                  <div
                    key={i}
                    className="w-full h-8 rounded transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `rgb(${255 * vulnerability}, ${255 * (1 - vulnerability)}, 0)`,
                      opacity: 0.7
                    }}
                    title={`Vulnerability: ${Math.round(vulnerability * 100)}%`}
                  />
                );
              })}
            </div>
            <div className="text-center mt-4 text-cyan-300 text-sm">
              Urban vulnerability heatmap
            </div>
          </div>
        );
      
      case "predictive":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8">
            <div className="flex justify-between items-end h-40">
              <div className="flex flex-col items-center">
                <div className="bg-red-500/50 w-12 rounded-t-lg" style={{ height: '80%' }}></div>
                <div className="text-red-300 text-sm mt-2">38°C</div>
                <div className="text-red-400 text-xs">Before</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-500/50 w-12 rounded-t-lg" style={{ height: '60%' }}></div>
                <div className="text-green-300 text-sm mt-2">32°C</div>
                <div className="text-green-400 text-xs">After</div>
              </div>
            </div>
            <div className="text-cyan-300 text-center mt-4 text-sm">
              Heat reduction through intervention
            </div>
          </div>
        );
      
      case "regional":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8">
            <div className="flex justify-around items-center h-full">
              {['Dhaka', 'Delhi', 'Mumbai', 'Chennai', 'Karachi'].map((city, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                    <div className="text-white text-xs">{city[0]}</div>
                  </div>
                  <div className="text-cyan-300 text-xs">{city}</div>
                </div>
              ))}
            </div>
            <div className="text-cyan-300 text-center mt-4 text-sm">
              Connected cities network
            </div>
          </div>
        );
      
      case "planetary":
        return (
          <div className="relative w-80 h-64 mx-auto mb-8">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-lg flex items-center justify-center">
              <FiGlobe className="text-white text-4xl" />
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden">
      {/* Help overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiHelpCircle className="text-cyan-400" /> How to Navigate
            </h3>
            <ul className="text-gray-300 space-y-3">
              <li>• Use the navigation buttons or dots to explore different phases</li>
              <li>• Click the play button to automatically move through the journey</li>
              <li>• Each phase shows a different aspect of our vision</li>
              <li>• Use arrow keys for keyboard navigation</li>
            </ul>
            <button 
              className="mt-6 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              onClick={() => setShowHelp(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header controls */}
      <div className="fixed top-4 left-4 right-4 z-30 bg-gray-800/80 backdrop-blur-md rounded-xl p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">ASTRA Vision Roadmap</h1>
          <p className="text-cyan-300 text-sm">The evolution of urban resilience</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            onClick={() => setShowHelp(true)}
            title="Show help"
          >
            <FiHelpCircle size={20} />
          </button>
          <button 
            className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Auto-play"}
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-4 left-4 right-4 z-30 bg-gray-800/80 backdrop-blur-md rounded-xl p-4">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentPhase / (phases.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Phase {currentPhase + 1} of {phases.length}</span>
          <span className="text-cyan-300">{phases[currentPhase].title}</span>
        </div>
      </div>

      {/* Navigation arrows */}
      {currentPhase > 0 && (
        <button 
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors backdrop-blur-md"
          onClick={() => goToPhase(currentPhase - 1)}
          title="Previous phase"
        >
          <FiChevronLeft size={24} />
        </button>
      )}
      
      {currentPhase < phases.length - 1 && (
        <button 
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors backdrop-blur-md"
          onClick={() => goToPhase(currentPhase + 1)}
          title="Next phase"
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Main content */}
      <div className="pt-24 pb-28">
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
              <div className="max-w-4xl w-full bg-gray-800/30 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-700/50">
                <div className="text-center mb-6">
                  <span className="text-cyan-400 font-semibold">Phase {index + 1}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{phase.title}</h2>
                  <p className="text-lg text-gray-300 mt-2">{phase.subtitle}</p>
                </div>

                {/* Visualization */}
                {renderVisualization(phase.visualization)}

                <div className="bg-gray-900/50 rounded-xl p-6 mt-6">
                  <p className="text-lg text-cyan-100 text-center mb-6 italic">"{phase.description}"</p>
                  
                  {/* Features */}
                  {phase.features && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {phase.features.map((feature, i) => (
                        <div key={i} className="bg-gray-800/50 p-4 rounded-lg text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-lg mb-2 text-cyan-400">
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
                        <div key={i} className="text-center">
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
                        <div key={i} className={`p-4 rounded-lg text-center ${
                          i === 0 ? 'bg-red-900/30' : 'bg-green-900/30'
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
                  {phase.alert && (
                    <div className="mt-6 p-4 bg-amber-900/30 rounded-lg">
                      <div className="text-amber-300 font-semibold mb-2">{phase.alert.title}</div>
                      <div className="text-amber-200 text-sm">{phase.alert.message}</div>
                    </div>
                  )}
                  
                  {/* Missions */}
                  {phase.missions && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {phase.missions.map((mission, i) => (
                        <div key={i} className="bg-gray-800/50 p-3 rounded-lg text-center">
                          <div className="text-2xl mb-1">{mission.icon}</div>
                          <div className="text-cyan-400 font-semibold text-sm">{mission.name}</div>
                          <div className="text-gray-300 text-xs">{mission.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Data source */}
                  {phase.data && (
                    <div className="mt-6 text-sm text-cyan-300/80 text-center">
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
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex justify-center gap-3 bg-gray-800/80 backdrop-blur-md rounded-full p-3">
        {phases.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentPhase === index ? 'bg-cyan-400 scale-125' : 'bg-white/30 hover:bg-cyan-500/50'
            }`}
            onClick={() => goToPhase(index)}
            title={`Go to Phase ${index + 1}: ${phases[index].title}`}
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
      `}</style>
    </div>
  );
};

export default Simulate;