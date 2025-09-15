import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { FaRocket, FaHandshake, FaSatellite, FaChartLine } from "react-icons/fa";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Animation trigger
    setIsVisible(true);
    
    // Mouse movement tracker for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Navigation handler
  const handleExplorePlatform = () => {
    navigate('/pulse');
  };

  // Helper functions for random values
  const getRandomPercentage = () => Math.random() * 100;
  const getRandomSize = () => Math.random() * 3;
  const getRandomDelay = () => Math.random() * 5;
  const getRandomDuration = () => 3 + Math.random() * 4;
  const getRandomFlowDuration = () => 15 + Math.random() * 10;
  const getRandomOpacity = () => Math.random() * 0.7 + 0.3;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Nebula Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900 via-black to-black">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${getRandomSize()}px`,
                height: `${getRandomSize()}px`,
                left: `${getRandomPercentage()}%`,
                top: `${getRandomPercentage()}%`,
                opacity: getRandomOpacity(),
                animationDelay: `${getRandomDelay()}s`,
                animationDuration: `${getRandomDuration()}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Distant galaxies */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl"></div>
      </div>

      {/* Moving Earth with Lottie Animation */}
      <div className="absolute inset-0 z-1 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Player
            autoplay
            loop
            src="/Globe_black.json"
            className="w-full h-full object-cover opacity-50"
          />
          {/* Enhanced overlay for better integration */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black/40"></div>
        </div>
      </div>

      {/* Interactive Data Points and Satellites */}
      <div className="absolute z-10 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full">
          {/* Data points on globe */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 40;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            return (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-green-500/80 cursor-pointer transform transition-all duration-500 hover:scale-150 hover:bg-green-400 pointer-events-auto"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) scale(${1 + mousePosition.x * 0.1})`,
                  boxShadow: '0 0 15px 5px rgba(72, 187, 120, 0.7)'
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Data Point {i+1}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Orbiting satellites */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 rounded-full bg-white/90 flex items-center justify-center pointer-events-none"
            style={{
              animation: `orbit ${15 + i * 5}s linear infinite`,
              animationDelay: `${i * 2}s`,
              boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)'
            }}
          >
            <FaSatellite className="text-blue-800 text-xs" />
          </div>
        ))}
      </div>

      {/* Data stream elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400/30 text-xs font-mono"
            style={{
              left: `${10 + (i * 6)}%`,
              animation: `flowUp ${getRandomFlowDuration()}s linear infinite`,
              animationDelay: `${getRandomDelay()}s`
            }}
          >
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Foreground Content */}
      <div
        className={`relative z-20 max-w-5xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          ASTRA
          <br />
          <span className="text-green-400">The Digital Nervous System</span>
          <br />
          for Earth's Cities
        </h1>

        <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-10">
          Powered by NASA Earth Observation Data. Transforming how cities respond to{" "}
          <span className="text-green-300 font-semibold">change</span>,{" "}
          <span className="text-yellow-300 font-semibold">challenges</span>, and{" "}
          <span className="text-blue-300 font-semibold">opportunities</span>.
        </p>

        {/* Enhanced CTA Buttons - Modified for navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleExplorePlatform}
            className="group relative bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-500 overflow-hidden hover:shadow-lg hover:shadow-green-500/40 flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center">
              <FaRocket className="text-lg mr-2 group-hover:animate-bounce" />
              Explore the Platform
            </span>
          </button>
        </div>
        
        {/* Real-time data indicator */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-blue-300">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span>Receiving live data from 12 satellites</span>
          </div>
          <div className="flex items-center">
            <FaChartLine className="mr-2" />
            <span>Monitoring 247 cities worldwide</span>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes flowUp {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-100px);
          }
        }
        
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(200px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(200px) rotate(-360deg);
          }
        }
        
        @media (max-width: 768px) {
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(120px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(120px) rotate(-360deg);
            }
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;