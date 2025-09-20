import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Download, 
  Share2,
  BarChart3,
  Eye,
  MapPin,
  X,
  Satellite,
  CloudRain,
  Gauge,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const mockMetrics = {
  temperature: { current: 32.5, unit: '°C', trend: 15.2 },
  airQuality: { current: 75, unit: 'AQI', trend: -8.1 },
  floodRisk: { current: 23, unit: '%', trend: 42.3 },
  energy: { current: 892, unit: 'kWh', trend: -12.5 }
};

const mockTimelineData = [
  { day: 'Today', temp: 32.5, aqi: 75, flood: 23, energy: 892 },
  { day: '+1d', temp: 33.1, aqi: 78, flood: 25, energy: 885 },
  { day: '+3d', temp: 34.2, aqi: 82, flood: 31, energy: 867 },
  { day: '+7d', temp: 36.8, aqi: 89, flood: 45, energy: 823 },
  { day: '+30d', temp: 39.4, aqi: 105, flood: 67, energy: 756 }
];

// Custom UI components
const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-gray-700 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`font-semibold text-lg ${className}`} {...props}>
    {children}
  </h3>
);

const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  const variantClasses = {
    default: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20',
    outline: 'border border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/10',
    destructive: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/20'
  };
  const sizeClasses = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-6 py-2',
    lg: 'h-11 px-8 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors';
  const variantClasses = {
    default: 'bg-gray-700/50 text-gray-300',
    destructive: 'bg-gradient-to-r from-rose-500/20 to-pink-600/20 text-rose-300 border border-rose-500/30',
    outline: 'border border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
};

const DialogContent = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 relative z-50 max-w-2xl w-full mx-auto ${className}`}
    {...props}
  >
    {children}
  </div>
);

const DialogHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = '', ...props }) => (
  <h2 className={`text-xl font-bold ${className}`} {...props}>
    {children}
  </h2>
);

// SimpleMap placeholder component
const SimpleMap = ({ activeMetric, timelineIndex, compareMode, onFeatureClick }) => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center relative overflow-hidden rounded-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5"></div>
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
    <div className="relative z-10 text-center p-8 bg-gray-900/70 backdrop-blur-md rounded-2xl border border-cyan-500/30">
      <div className="text-cyan-400 text-2xl font-bold mb-2 flex items-center justify-center gap-2">
        <Satellite className="w-6 h-6" />
        3D Urban Data Visualization
      </div>
      <div className="text-gray-300 text-sm mb-4">
        Active metric: {activeMetric} | Timeline: {timelineIndex} | Compare: {compareMode ? 'On' : 'Off'}
      </div>
      <Button 
        className="mt-4" 
        onClick={() => onFeatureClick({ properties: { name: 'Downtown District' } })}
      >
        Simulate Map Click
      </Button>
    </div>
    <div className="absolute bottom-4 right-4 text-xs text-gray-500 flex items-center gap-1">
      <span>Powered by NASA Earth Data & Deck.gl</span>
    </div>
  </div>
);

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  current: number;
  predicted: number;
  unit: string;
  trend: number;
  color: string;
  onClick: () => void;
  isActive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, title, current, predicted, unit, trend, color, onClick, isActive 
}) => {
  const isIncrease = predicted > current;
  const percentChange = ((predicted - current) / current * 100);
  
  const colorMap = {
    '--data-heat': 'from-orange-500 to-rose-600',
    '--data-warning': 'from-amber-500 to-yellow-600',
    '--data-cool': 'from-cyan-500 to-blue-600',
    '--data-nature': 'from-emerald-500 to-green-600'
  };

  const colorClass = colorMap[color] || 'from-cyan-500 to-blue-600';
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
        isActive 
          ? `ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20 bg-gradient-to-br ${colorClass} bg-opacity-20` 
          : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10' : 'bg-gray-700/50'}`}>
              {icon}
            </div>
            <h3 className="font-semibold text-gray-200">{title}</h3>
          </div>
          <Badge 
            variant={isIncrease ? "destructive" : "default"}
            className="text-xs"
          >
            {isIncrease ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(percentChange).toFixed(1)}%
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{current.toFixed(1)}</span>
            <span className="text-sm text-gray-400">{unit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Projected:</span>
            <span className={`font-medium ${isIncrease ? 'text-rose-300' : 'text-emerald-300'}`}>
              {predicted.toFixed(1)} {unit}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface DataStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string;
  location: string;
  data: any[];
}

const DataStoryModal: React.FC<DataStoryModalProps> = ({ 
  isOpen, onClose, metric = '', location = '', data = [] 
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2 text-cyan-400">
              <MapPin className="w-5 h-5" />
              {metric} Alert in {location}
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-700/30 border-l-4 border-cyan-500">
            <h4 className="font-semibold text-cyan-400 mb-2">Key Insight</h4>
            <p className="text-sm text-gray-300">
              Critical {metric?.toLowerCase() || 'metric'} levels detected. Immediate attention required 
              for sustainable urban planning intervention.
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={metric?.toLowerCase().includes('temp') ? 'temp' : 
                           metric?.toLowerCase().includes('air') ? 'aqi' :
                           metric?.toLowerCase().includes('flood') ? 'flood' : 'energy'} 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Data Source: NASA Earth Data via MODIS, IMERG, and OMI sensors</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DataLab: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<string>('temperature');
  const [timelineIndex, setTimelineIndex] = useState<number>(0);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({ metric: '', location: '', data: [] });

  // DEMO: Simple prediction calculation - Replace with LSTM/Prophet model inference
  const getPredictedValue = useCallback((current: number, growthRate: number, timeIndex: number) => {
    return current * (1 + (timeIndex * growthRate / 100));
  }, []);

  const currentTimelineData = useMemo(() => mockTimelineData[timelineIndex], [timelineIndex]);
  
  const metrics = useMemo(() => [
    {
      id: 'temperature',
      icon: <Thermometer className="w-4 h-4 text-orange-400" />,
      title: 'Surface Temperature',
      current: mockMetrics.temperature.current,
      predicted: getPredictedValue(mockMetrics.temperature.current, mockMetrics.temperature.trend, timelineIndex),
      unit: mockMetrics.temperature.unit,
      trend: mockMetrics.temperature.trend,
      color: '--data-heat'
    },
    {
      id: 'airQuality',
      icon: <Wind className="w-4 h-4 text-amber-400" />,
      title: 'Air Quality Index',
      current: mockMetrics.airQuality.current,
      predicted: getPredictedValue(mockMetrics.airQuality.current, mockMetrics.airQuality.trend, timelineIndex),
      unit: mockMetrics.airQuality.unit,
      trend: mockMetrics.airQuality.trend,
      color: '--data-warning'
    },
    {
      id: 'floodRisk',
      icon: <Droplets className="w-4 h-4 text-cyan-400" />,
      title: 'Flood Risk',
      current: mockMetrics.floodRisk.current,
      predicted: getPredictedValue(mockMetrics.floodRisk.current, mockMetrics.floodRisk.trend, timelineIndex),
      unit: mockMetrics.floodRisk.unit,
      trend: mockMetrics.floodRisk.trend,
      color: '--data-cool'
    },
    {
      id: 'energy',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      title: 'Energy Consumption',
      current: mockMetrics.energy.current,
      predicted: getPredictedValue(mockMetrics.energy.current, mockMetrics.energy.trend, timelineIndex),
      unit: mockMetrics.energy.unit,
      trend: mockMetrics.energy.trend,
      color: '--data-nature'
    }
  ], [timelineIndex, getPredictedValue]);

  const handleMetricClick = useCallback((metricId: string) => {
    setActiveMetric(metricId);
    // Focus map on worst-affected area for this metric
    const metric = metrics.find(m => m.id === metricId);
    if (metric) {
      setModalData({
        metric: metric.title,
        location: 'Downtown District',
        data: mockTimelineData
      });
      setShowModal(true);
    }
  }, [metrics]);

  const handleExportSnapshot = useCallback(async () => {
    // DEMO: Replace with html2canvas implementation
    console.log('Exporting snapshot...', { activeMetric, timelineIndex, compareMode });
    // const html2canvas = (await import('html2canvas')).default;
    // Implementation would capture the current view
  }, [activeMetric, timelineIndex, compareMode]);

  const handleRunSimulation = useCallback(() => {
    // Navigate to simulation with current parameters
    console.log('Running simulation...', { metric: activeMetric, timeIndex: timelineIndex });
  }, [activeMetric, timelineIndex]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-rose-500/5"></div>
      
      {/* Quick Action Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-4"
      >
        {/* <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ASTRA DataLab
              </h1>
            </motion.div>
            <Badge variant="outline" className="animate-pulse bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
              Live Data
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunSimulation}
              className="border-cyan-500/30 text-cyan-400"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCompareMode(!compareMode)}
              className={compareMode ? 'border-cyan-500 text-cyan-400 ring-2 ring-cyan-500/30' : 'border-cyan-500/30 text-cyan-400'}
            >
              <Eye className="w-4 h-4 mr-2" />
              Compare Mode
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSnapshot} className="border-cyan-500/30 text-cyan-400">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div> */}
      </motion.div>

      {/* Main Content Grid */}
      <div className="pt-24 h-full grid grid-cols-12 grid-rows-12 gap-4 p-4">
        {/* 3D Map Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 row-span-9 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20"
        >
          <SimpleMap 
            activeMetric={activeMetric}
            timelineIndex={timelineIndex}
            compareMode={compareMode}
            onFeatureClick={(feature) => {
              setModalData({
                metric: activeMetric,
                location: feature.properties?.name || 'Selected Area',
                data: mockTimelineData
              });
              setShowModal(true);
            }}
          />
        </motion.div>

        {/* Metrics Dashboard */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-4 row-span-9 space-y-4 overflow-y-auto"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400 pl-2">
            <BarChart3 className="w-5 h-5" />
            Urban Health Metrics
          </h2>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <MetricCard
                {...metric}
                onClick={() => handleMetricClick(metric.id)}
                isActive={activeMetric === metric.id}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Slider */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="col-span-12 row-span-3 bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cyan-400">Prediction Timeline</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Current: {currentTimelineData.day}</span>
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                  AI Forecast: {timelineIndex === 0 ? 'Real-time' : `+${timelineIndex * 7} days`}
                </Badge>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="4"
                value={timelineIndex}
                onChange={(e) => setTimelineIndex(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb-cyan"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {mockTimelineData.map((data, index) => (
                  <span 
                    key={index} 
                    className={index === timelineIndex ? 'text-cyan-400 font-medium' : ''}
                  >
                    {data.day}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              {/* DEMO: Replace with LSTM/Prophet model inference from NASA GES DISC & historical data */}
              Predictive model based on NASA GES DISC historical data and trend analysis
            </div>
          </div>
        </motion.div>
      </div>

      {/* Compare Mode Toggle */}
      <div className="absolute bottom-24 left-6">
        <motion.button 
          onClick={() => setCompareMode(!compareMode)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4" />
          {compareMode ? 'Exit Compare Mode' : 'Compare & Correlate'}
        </motion.button>
      </div>

      {/* Data Story Modal */}
      <DataStoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        metric={modalData.metric}
        location={modalData.location}
        data={modalData.data}
      />

      {/* Custom styles for range slider */}
      <style jsx>{`
        .slider-thumb-cyan::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        
        .slider-thumb-cyan::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default DataLab;