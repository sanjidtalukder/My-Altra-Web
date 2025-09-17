import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Thermometer, Droplets, Wind, Flame } from 'lucide-react';

interface DataPanelProps {
  className?: string;
}

const DataPanel: React.FC<DataPanelProps> = ({ className = '' }) => {
  const metrics = [
    {
      id: 'temperature',
      icon: Thermometer,
      title: 'Heat Stress',
      value: '42.3°C',
      change: '+2.1°C',
      status: 'critical',
      description: 'Peak temperature in Ward 12'
    },
    {
      id: 'flood',
      icon: Droplets,
      title: 'Flood Risk',
      value: '78%',
      change: '+12%',
      status: 'warning',
      description: 'Probability next 24h'
    },
    {
      id: 'air_quality',
      icon: Wind,
      title: 'Air Quality',
      value: '156 AQI',
      change: '+23',
      status: 'unhealthy',
      description: 'PM2.5 levels downtown'
    },
    {
      id: 'population',
      icon: Users,
      title: 'At Risk Pop.',
      value: '84.2K',
      change: '+5.1K',
      status: 'info',
      description: 'Vulnerable residents'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Heat Emergency - Ward 12',
      time: '2 min ago',
      description: 'Temperature exceeded 40°C threshold, affecting 12,480 elderly residents'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Flood Watch - River District',
      time: '15 min ago',
      description: 'Water levels rising, evacuation routes prepped for 6,200 residents'
    },
    {
      id: 3,
      type: 'info',
      title: 'Air Quality Deteriorating',
      time: '1 hour ago',
      description: 'PM2.5 levels increased 23% due to traffic surge'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'unhealthy': return 'text-accent';
      case 'info': return 'text-info';
      default: return 'text-primary';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-error/10 border-error/30';
      case 'warning': return 'bg-warning/10 border-warning/30';
      case 'unhealthy': return 'bg-accent/10 border-accent/30';
      case 'info': return 'bg-info/10 border-info/30';
      default: return 'bg-primary/10 border-primary/30';
    }
  };

  const getAlertType = (type: string) => {
    switch (type) {
      case 'critical': return { color: 'text-error', bg: 'bg-error/20' };
      case 'warning': return { color: 'text-warning', bg: 'bg-warning/20' };
      case 'info': return { color: 'text-info', bg: 'bg-info/20' };
      default: return { color: 'text-primary', bg: 'bg-primary/20' };
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Real-time Metrics */}
      <div className="command-panel rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <h2 className="text-sm font-bold text-primary font-['Orbitron']">REAL-TIME METRICS</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getStatusBg(metric.status)} hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                    <span className="text-xs font-medium text-primary">{metric.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${metric.status === 'critical' ? 'bg-error text-error-content' : 'bg-base-300 text-base-content'}`}>
                    {metric.change}
                  </span>
                </div>
                
                <div className="mb-1">
                  <span className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="command-panel rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h2 className="text-sm font-bold text-primary font-['Orbitron']">ACTIVE ALERTS</h2>
          <span className="text-xs bg-warning text-warning-content px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.map((alert, index) => {
            const alertStyle = getAlertType(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg ${alertStyle.bg} hover:scale-[1.01] transition-transform cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-sm font-medium ${alertStyle.color}`}>
                    {alert.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {alert.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="command-panel rounded-lg p-4">
        <h2 className="text-sm font-bold text-primary font-['Orbitron'] mb-4">SYSTEM STATUS</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">NASA Data Feed</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success">Online</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Risk Analysis Engine</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success">Processing</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Community Database</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span className="text-xs text-warning">Updating</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Last Update</div>
            <div className="text-xs text-primary">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;