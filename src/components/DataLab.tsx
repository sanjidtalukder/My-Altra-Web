import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Badge
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SimpleMap from './SimpleMap';
import { CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

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
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`data-card cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-primary glow-cyan' : ''
      }`}
      onClick={onClick}
      style={{ 
        background: isActive 
          ? `linear-gradient(135deg, hsl(var(--card)), hsl(var(${color})) / 0.2)` 
          : undefined 
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge 
            variant={isIncrease ? "destructive" : "default"}
            className="text-xs"
          >
            {isIncrease ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(percentChange).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="metric-value">{current}</span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Predicted:</span>
            <span className={`font-medium ${isIncrease ? 'text-destructive' : 'text-accent'}`}>
              {predicted.toFixed(1)} {unit}
            </span>
          </div>
        </div>
      </CardContent>
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl cyber-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {metric} Alert in {location}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/20 border-l-4 border-primary">
            <h4 className="font-semibold text-primary mb-2">Key Insight</h4>
            <p className="text-sm text-muted-foreground">
              Critical {metric?.toLowerCase() || 'metric'} levels detected. Immediate attention required 
              for sustainable urban planning intervention.
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={metric?.toLowerCase().includes('temp') ? 'temp' : 
                           metric?.toLowerCase().includes('air') ? 'aqi' :
                           metric?.toLowerCase().includes('flood') ? 'flood' : 'energy'} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Data Source: NASA Earth Data via MODIS, IMERG, and OMI sensors
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
      icon: <Thermometer className="w-4 h-4 text-data-heat" />,
      title: 'Surface Temperature',
      current: mockMetrics.temperature.current,
      predicted: getPredictedValue(mockMetrics.temperature.current, mockMetrics.temperature.trend, timelineIndex),
      unit: mockMetrics.temperature.unit,
      trend: mockMetrics.temperature.trend,
      color: '--data-heat'
    },
    {
      id: 'airQuality',
      icon: <Wind className="w-4 h-4 text-data-warning" />,
      title: 'Air Quality Index',
      current: mockMetrics.airQuality.current,
      predicted: getPredictedValue(mockMetrics.airQuality.current, mockMetrics.airQuality.trend, timelineIndex),
      unit: mockMetrics.airQuality.unit,
      trend: mockMetrics.airQuality.trend,
      color: '--data-warning'
    },
    {
      id: 'floodRisk',
      icon: <Droplets className="w-4 h-4 text-data-cool" />,
      title: 'Flood Risk',
      current: mockMetrics.floodRisk.current,
      predicted: getPredictedValue(mockMetrics.floodRisk.current, mockMetrics.floodRisk.trend, timelineIndex),
      unit: mockMetrics.floodRisk.unit,
      trend: mockMetrics.floodRisk.trend,
      color: '--data-cool'
    },
    {
      id: 'energy',
      icon: <Building2 className="w-4 h-4 text-data-nature" />,
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
    <div className="h-screen w-full bg-background text-foreground overflow-hidden z-10">
      {/* Quick Action Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-4"
      >
        <div className="flex items-center justify-between cyber-border bg-background/90 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ASTRA DataLab
            </h1>
            <Badge variant="outline" className="animate-pulse-glow">
              Live Data
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunSimulation}
              className="cyber-border"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCompareMode(!compareMode)}
              className={compareMode ? 'ring-2 ring-primary' : ''}
            >
              <Eye className="w-4 h-4 mr-2" />
              Compare Mode
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSnapshot}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="pt-20 h-full grid grid-cols-12 grid-rows-12 gap-4 p-4">
        {/* 3D Map Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 row-span-9 cyber-border rounded-lg overflow-hidden"
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
          className="col-span-4 row-span-9 space-y-3 overflow-y-auto"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
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
          className="col-span-12 row-span-3 cyber-border rounded-lg p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Prediction Timeline</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Current: {currentTimelineData.day}</span>
                <Badge variant="outline">
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
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(timelineIndex / 4) * 100}%, hsl(var(--muted)) ${(timelineIndex / 4) * 100}%, hsl(var(--muted)) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                {mockTimelineData.map((data, index) => (
                  <span 
                    key={index} 
                    className={index === timelineIndex ? 'text-primary font-medium' : ''}
                  >
                    {data.day}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              // DEMO: Replace with LSTM/Prophet model inference from NASA GES DISC & historical data
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Story Modal */}
      <DataStoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        metric={modalData.metric}
        location={modalData.location}
        data={modalData.data}
      />
    </div>
  );
};

export default DataLab;