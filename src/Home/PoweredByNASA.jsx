import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSatellite, FaGlobeAmericas, FaCloud, FaDatabase, FaInfoCircle, FaArrowRight, FaRocket, FaWind, FaEye, FaCity, FaMapMarkedAlt } from "react-icons/fa";

const sources = [
  { 
    name: "MODIS", 
    icon: <FaSatellite size={36} className="text-blue-400" />,
    description: "Moderate Resolution Imaging Spectroradiometer provides comprehensive imagery of Earth's surface and atmosphere."
  },
  { 
    name: "VIIRS", 
    icon: <FaGlobeAmericas size={36} className="text-green-400" />,
    description: "Visible Infrared Imaging Radiometer Suite delivers high-resolution environmental data day and night."
  },
  { 
    name: "GIBS", 
    icon: <FaCloud size={36} className="text-indigo-300" />,
    description: "Global Imagery Browse Services offers quick access to satellite imagery for visualization and analysis."
  },
  { 
    name: "Earthdata", 
    icon: <FaDatabase size={36} className="text-orange-300" />,
    description: "Earthdata Search provides a modern interface for discovering, accessing, and using NASA Earth science data."
  },
   {
    name: "OpenAQ",
    icon: <FaWind size={36} className="text-teal-300" />,
    description: "Aggregates global air quality data from government and research-grade sensors—ideal for urban health insights."
  },
  {
    name: "Sentinel Hub",
    icon: <FaEye size={36} className="text-purple-300" />,
    description: "Provides real-time satellite data streams with customizable layers—perfect for dynamic environmental monitoring."
  },
   {
    name: "NASA SEDAC",
    icon: <FaCity size={36} className="text-pink-300" />,
    description: "Socioeconomic Data and Applications Center offers geospatial data on population, infrastructure, and urban growth."
  },
 {
    name: "Landsat",
    icon: <FaMapMarkedAlt size={36} className="text-yellow-400" />,
    description: "Historic and current land cover data—essential for tracking urban expansion and ecological change."
},


];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

// New flip animation variants
const flipCardVariants = {
  hidden: { scale: 0.9, opacity: 0, rotateY: -15 },
  visible: {
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    rotateY: 180,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

const flipContentVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.35 }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.35 }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 12,
      delay: 0.2
    }
  }
};

const PoweredByNASA = () => {
  const [flippedCards, setFlippedCards] = useState({});

  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <motion.section 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden py-16 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background stars */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDAwIi8+CiAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMC41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjA1Ii8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMC43IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjA3Ii8+CiAgPGNpcmNsZSBjeD0iMjUiIGN5PSI0NSIgcj0iMC4zIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjA0Ii8+CiAgPGNpcmNsZSBjeD0iNDAiIGN5PSIyMCIgcj0iMC42IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjA2Ii8+Cjwvc3ZnPg==')] opacity-10 bg-cover bg-center"></div>
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            initial={{ y: 0, opacity: 0.5 }}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.5, 0.7, 0.5],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              width: Math.random() * 20 + 5 + 'px',
              height: Math.random() * 20 + 5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.header 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-blue-900/30 rounded-full mb-6 backdrop-blur-sm border border-blue-700/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
            }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              <FaSatellite className="text-3xl text-blue-300" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            Science in Orbit. Hope on the Ground.
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            NASA satellites silently circle the Earth, capturing oceans shifting color, forests breathing,
            ice sheets thinning, and climate patterns changing.
          </motion.p>
          
          <motion.div 
            className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-5 max-w-2xl mx-auto border border-blue-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: "rgba(30, 58, 138, 0.3)"
            }}
          >
            <p className="text-blue-200 flex items-start">
              <motion.span
                animate={{
                  y: [0, -5, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity
                  }
                }}
              >
                <FaInfoCircle className="mt-1 mr-3 flex-shrink-0 text-blue-400" />
              </motion.span>
              <span>Hover over the cards to flip them and discover NASA's data sources. All data is sourced from NASA's open data repositories.</span>
            </p>
          </motion.div>
        </motion.header>

        {/* Data Source Cards with Flip Animation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
        >
          {sources.map((item, i) => (
            <div key={i} className="perspective-1000 h-64">
              <motion.div
                variants={flipCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="relative w-full h-full cursor-pointer"
                onClick={() => handleCardFlip(i)}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of Card */}
                <motion.div 
                  className="absolute inset-0 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center 
                            border border-gray-700/40"
                  variants={flipContentVariants}
                  animate={flippedCards[i] ? "back" : "front"}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-gray-900/60 flex items-center justify-center mb-4"
                    variants={iconVariants}
                  >
                    {item.icon}
                  </motion.div>
                  
                  <motion.h3 
                    className="font-bold text-xl text-white mt-4"
                  >
                    {item.name}
                  </motion.h3>
                  
                  <p className="text-sm text-gray-400 mt-2 text-center">NASA Climate Data Source</p>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="text-xs text-blue-400 animate-pulse">Hover to explore</p>
                  </div>
                </motion.div>

                {/* Back of Card */}
                <motion.div 
                  className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center 
                            border border-blue-500/30 justify-center"
                  variants={flipContentVariants}
                  initial={{ rotateY: 180 }}
                  animate={flippedCards[i] ? "front" : "back"}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <h3 className="font-bold text-xl text-white mb-3">{item.name}</h3>
                  <p className="text-gray-200 text-sm text-center mb-4">{item.description}</p>
                  <motion.button 
                    className="text-blue-300 text-sm flex items-center justify-center mx-auto mt-2 px-4 py-2 rounded-lg bg-blue-900/40 border border-blue-600/30"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 64, 175, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn more <FaArrowRight className="ml-2 text-xs" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        {/* <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.h3 
            className="text-2xl font-semibold text-white mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Ready to explore NASA's data?
          </motion.h3>
          
          <motion.p 
            className="text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Start discovering how Earth's systems are changing through NASA's extensive satellite data collection.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket className="mr-2" /> Explore Data Dashboard
            </motion.button>
            
            <motion.button 
              className="bg-transparent text-gray-300 font-medium py-3 px-8 rounded-lg border border-gray-600"
              whileHover={{ 
                y: -3,
                backgroundColor: "rgba(31, 41, 55, 0.5)",
                borderColor: "rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn About NASA's Missions
            </motion.button>
          </div>
        </motion.div> */}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </motion.section>
  );
};

export default PoweredByNASA;