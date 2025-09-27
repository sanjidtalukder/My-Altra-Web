// src/components/civic-engagement/ImpactTracker/ImpactTracker.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Users,
  TreePine,
  Droplets,
  Thermometer
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ImpactTracker = ({ activeProposal, userLocation }) => {
  // Sample impact data
  const impactData = {
    personalImpact: 245,
    communityImpact: 1245,
    proposalsInfluenced: 3,
    veracityMissions: 8,
    carbonReduction: 12.4, // tons
    temperatureReduction: 2.3, // °C
    floodPrevention: 45 // %
  };

  const temperatureData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Temperature Anomaly (°C)',
        data: [4.2, 4.5, 4.8, 5.1, 5.3, 5.2, 4.9],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const sentimentData = {
    labels: ['Support', 'Neutral', 'Oppose'],
    datasets: [
      {
        data: [72, 18, 10],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderColor: 'white'
      }
    ]
  };

  const ImpactCard = ({ icon, title, value, unit, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
          Impact Tracker
        </h2>
        <p className="text-sm text-gray-600">Measuring democratic change</p>
      </div>

      {/* Personal Impact Score */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Your Civic Impact Score</p>
            <p className="text-3xl font-bold text-gray-900">{impactData.personalImpact}</p>
            <p className="text-xs text-gray-500">Top 15% of participants</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Award className="w-8 h-8 text-green-600" />
          </motion.div>
        </div>
      </div>

      {/* Impact Metrics Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <ImpactCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Community Impact"
          value={impactData.communityImpact}
          color="bg-blue-100"
        />
        <ImpactCard
          icon={<Target className="w-6 h-6 text-purple-600" />}
          title="Proposals Influenced"
          value={impactData.proposalsInfluenced}
          color="bg-purple-100"
        />
        <ImpactCard
          icon={<TreePine className="w-6 h-6 text-green-600" />}
          title="Carbon Reduction"
          value={impactData.carbonReduction}
          unit="tons"
          color="bg-green-100"
        />
        <ImpactCard
          icon={<Thermometer className="w-6 h-6 text-orange-600" />}
          title="Temp Reduction"
          value={impactData.temperatureReduction}
          unit="°C"
          color="bg-orange-100"
        />
      </div>

      {/* Charts Section */}
      <div className="p-4 space-y-4">
        {/* Temperature Trend */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-red-500" />
            Heat Anomaly Trend
          </h3>
          <div className="h-32">
            <Line 
              data={temperatureData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0,0,0,0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            Community Sentiment
          </h3>
          <div className="h-32">
            <Doughnut
              data={sentimentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                cutout: '60%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Civic Legacy */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Civic Legacy</h3>
        <div className="space-y-2">
          {[
            { action: 'Verified heat zone', impact: 'Informed cooling center proposal', date: '2024-01-15' },
            { action: 'Supported park proposal', impact: 'Project approved with 85% vote', date: '2024-01-10' },
            { action: 'Reported drainage issue', impact: 'Added to city maintenance schedule', date: '2024-01-05' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-600">{item.impact}</p>
              </div>
              <span className="text-xs text-gray-500">{item.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
