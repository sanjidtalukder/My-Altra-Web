// src/components/civic-engagement/ProposalEngine/ProposalEngine.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TreePine, 
  Droplets, 
  Wind, 
  Users, 
  MessageCircle, 
  Clock,
  ArrowUpRight,
  Vote,
  Share2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  BarChart3,
  Satellite
} from 'lucide-react';

const ProposalEngine = ({ 
  activeProposal, 
  selectedNeighborhood, 
  environmentalAlerts = [], 
  nasaData = {},
  onProposalSelect,
  onVote,
  onShare
}) => {
  const [proposals, setProposals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('urgency');

  // Initialize with sample data
  useEffect(() => {
    const sampleProposals = [
      {
        id: 1,
        type: 'heat',
        title: 'Cooling Corridor Implementation',
        neighborhood: 'Midtown',
        description: 'Plant 150 native trees along 5th Avenue to combat urban heat island effect and reduce ambient temperature by 2-3°C',
        urgency: 'high',
        supporters: 234,
        comments: 89,
        votes: 156,
        nasaData: {
          temperature: '+5°C anomaly',
          treeCover: '40% below average',
          impact: '1.8°C reduction predicted',
          satellite: 'MODIS'
        },
        cost: '$45,000',
        timeline: '6 months',
        status: 'discussion',
        coordinates: [-74.006, 40.7549],
        created: '2024-01-15',
        deadline: '2024-03-15',
        progress: 65
      },
      {
        id: 2,
        type: 'flood',
        title: 'Green Drainage Infrastructure',
        neighborhood: 'Financial District',
        description: 'Install permeable pavements and rain gardens to reduce flood risk and improve stormwater management',
        urgency: 'medium',
        supporters: 156,
        comments: 45,
        votes: 89,
        nasaData: {
          floodRisk: 'High probability',
          precipitation: '+20% anomaly',
          impact: '30% runoff reduction',
          satellite: 'IMERG'
        },
        cost: '$120,000',
        timeline: '8 months',
        status: 'planning',
        coordinates: [-74.013, 40.7074],
        created: '2024-01-20',
        deadline: '2024-04-20',
        progress: 30
      },
      {
        id: 3,
        type: 'green',
        title: 'Community Pocket Park',
        neighborhood: 'Upper East Side',
        description: 'Convert vacant lot into vibrant community space with native plants, seating, and playground',
        urgency: 'low',
        supporters: 89,
        comments: 23,
        votes: 45,
        nasaData: {
          vegetation: 'Low NDVI score',
          airQuality: 'Moderate improvement',
          impact: '0.5 acres green space',
          satellite: 'Landsat'
        },
        cost: '$75,000',
        timeline: '4 months',
        status: 'approved',
        coordinates: [-73.959, 40.7734],
        created: '2024-01-10',
        deadline: '2024-02-28',
        progress: 90
      }
    ];
    setProposals(sampleProposals);
  }, []);

  // Filter proposals based on selected neighborhood and filter
  const filteredProposals = proposals.filter(proposal => {
    const neighborhoodMatch = !selectedNeighborhood || 
      proposal.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
    const filterMatch = filter === 'all' || proposal.type === filter || proposal.status === filter;
    return neighborhoodMatch && filterMatch;
  });

  // Sort proposals
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (sortBy) {
      case 'urgency':
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      case 'supporters':
        return b.supporters - a.supporters;
      case 'recent':
        return new Date(b.created) - new Date(a.created);
      default:
        return 0;
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'heat': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'flood': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'green': return <TreePine className="w-5 h-5 text-green-500" />;
      default: return <Wind className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'planning': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'discussion': return <MessageCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'planning': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'discussion': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleVote = (proposalId, voteType) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId ? { 
        ...p, 
        votes: voteType === 'up' ? p.votes + 1 : Math.max(0, p.votes - 1) 
      } : p
    ));
    onVote && onVote(proposalId, voteType);
  };

  const handleShare = (proposal) => {
    onShare && onShare(proposal);
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: proposal.title,
        text: proposal.description,
        url: window.location.href,
      });
    }
  };

  const handleProposalClick = (proposal) => {
    onProposalSelect && onProposalSelect(proposal);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
            Community Proposals
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {sortedProposals.length} active
          </span>
        </div>
        <p className="text-sm text-gray-600">NASA-data driven urban interventions</p>
        
        {/* Filters */}
        <div className="flex space-x-2 mt-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white"
          >
            <option value="all">All Types</option>
            <option value="heat">Heat Solutions</option>
            <option value="flood">Flood Prevention</option>
            <option value="green">Green Spaces</option>
            <option value="approved">Approved</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white"
          >
            <option value="urgency">Sort by Urgency</option>
            <option value="supporters">Most Supporters</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Environmental Alerts */}
      {environmentalAlerts.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
          <h3 className="text-sm font-semibold text-orange-800 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Environmental Alerts
          </h3>
          {environmentalAlerts.map(alert => (
            <div key={alert.id} className="text-xs text-orange-700 mt-1 flex items-center">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Proposals List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {sortedProposals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <TreePine className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>No proposals found</p>
              <p className="text-xs">Try changing your filters</p>
            </motion.div>
          ) : (
            sortedProposals.map(proposal => (
              <motion.div
                key={proposal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] ${
                  activeProposal?.id === proposal.id 
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                    : 'border-transparent hover:shadow-md'
                }`}
                onClick={() => handleProposalClick(proposal)}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getIcon(proposal.type)}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                          {proposal.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {proposal.neighborhood}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(proposal.urgency)}`}>
                            {proposal.urgency}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(proposal.status)} flex items-center`}>
                            {getStatusIcon(proposal.status)}
                            <span className="ml-1">{proposal.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{proposal.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${proposal.progress}%` }}
                    ></div>
                  </div>

                  {/* NASA Data Insights */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-3 border border-blue-100">
                    <h4 className="text-xs font-semibold text-blue-800 mb-2 flex items-center">
                      <Satellite className="w-3 h-3 mr-2" />
                      NASA Orbital Intelligence
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(proposal.nasaData).map(([key, value]) => (
                        <div key={key} className="text-blue-700 flex items-center">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="ml-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Users className="w-3 h-3 mr-1" />
                        {proposal.supporters}
                      </span>
                      <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {proposal.comments}
                      </span>
                      <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        {proposal.timeline}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(proposal.id, 'up');
                        }}
                        className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        title="Support proposal"
                      >
                        <Vote className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium text-gray-700 min-w-[20px] text-center">
                        {proposal.votes}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(proposal);
                        }}
                        className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Share proposal"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProposalClick(proposal);
                        }}
                        className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        title="View details"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Total Proposals: {proposals.length}</span>
          <span>Total Supporters: {proposals.reduce((sum, p) => sum + p.supporters, 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProposalEngine;