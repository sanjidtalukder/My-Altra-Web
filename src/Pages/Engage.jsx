import React, { useState, useEffect } from 'react';
import CivicMap from '../components/civic-engagement/CivicMap';
import DialogueOrchestrator from '../components/civic-engagement/DialogueOrchestrator';
import ImpactTracker from '../components/civic-engagement/ImpactTracker';
import ProposalEngine from '../components/civic-engagement/ProposalEngine';
import { 
  Map, 
  MessageCircle, 
  BarChart3, 
  Users, 
  Satellite,
  ChevronLeft,
  ChevronRight,
  X,
  Thermometer,
  Trees,
  Zap
} from 'lucide-react';

// Mock data for proposals
const mockProposals = [
  {
    id: 1,
    title: "Cooling Corridor for East Harlem",
    problem: "MODIS LST shows persistent 5°C heat anomaly affecting 4,200 residents",
    solution: "Plant 150 native trees along 125th Street transit corridor",
    status: "active",
    supporters: 420,
    needed: 1000,
    deadline: "2024-12-15",
    type: "heat",
    location: [-73.939, 40.798],
    nasaData: {
      temperatureAnomaly: 5.2,
      vegetationDeficit: 0.4,
      affectedPopulation: 4200
    },
    impact: {
      temperatureReduction: 1.8,
      healthcareSavings: 120000,
      cost: 45000
    }
  },
  {
    id: 2,
    title: "Flood Resilience Park - Lower East Side",
    problem: "GFMS data indicates high flood risk during heavy rainfall events",
    solution: "Create permeable green space with natural drainage systems",
    status: "active",
    supporters: 289,
    needed: 800,
    deadline: "2024-11-30",
    type: "flood",
    location: [-73.984, 40.714],
    nasaData: {
      floodRisk: 0.8,
      imperviousSurface: 0.85,
      affectedPopulation: 3200
    },
    impact: {
      floodReduction: 0.5,
      propertySavings: 250000,
      cost: 120000
    }
  }
];

const Engage = () => {
  const [activePanel, setActivePanel] = useState('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [proposals, setProposals] = useState(mockProposals);
  const [liveUpdates, setLiveUpdates] = useState([
    {
      id: 1,
      type: 'nasa',
      title: 'New heat data received',
      timestamp: '2 minutes ago',
      description: 'MODIS satellite data updated for NYC area'
    },
    {
      id: 2,
      type: 'community',
      title: '15 people joined discussion',
      timestamp: '5 minutes ago',
      description: 'East Harlem cooling project gaining traction'
    }
  ]);

  // Mobile-friendly navigation
  const navigationItems = [
    { id: 'map', label: 'City Map', icon: Map, color: 'blue' },
    { id: 'proposals', label: 'Proposals', icon: MessageCircle, color: 'green' },
    { id: 'dialogue', label: 'Conversations', icon: Users, color: 'purple' },
    { id: 'impact', label: 'My Impact', icon: BarChart3, color: 'orange' },
  ];

  // Get color classes for navigation
  const getColorClasses = (color, isActive) => {
    const baseClasses = "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200";
    
    if (isActive) {
      switch (color) {
        case 'blue': return `${baseClasses} bg-blue-100 text-blue-700 shadow-sm`;
        case 'green': return `${baseClasses} bg-green-100 text-green-700 shadow-sm`;
        case 'purple': return `${baseClasses} bg-purple-100 text-purple-700 shadow-sm`;
        case 'orange': return `${baseClasses} bg-orange-100 text-orange-700 shadow-sm`;
        default: return `${baseClasses} bg-gray-100 text-gray-700 shadow-sm`;
      }
    } else {
      return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
    }
  };

  // Get mobile color classes
  const getMobileColorClasses = (color, isActive) => {
    const baseClasses = "flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all";
    
    if (isActive) {
      switch (color) {
        case 'blue': return `${baseClasses} bg-blue-100 text-blue-700`;
        case 'green': return `${baseClasses} bg-green-100 text-green-700`;
        case 'purple': return `${baseClasses} bg-purple-100 text-purple-700`;
        case 'orange': return `${baseClasses} bg-orange-100 text-orange-700`;
        default: return `${baseClasses} bg-gray-100 text-gray-700`;
      }
    } else {
      return `${baseClasses} text-gray-600 hover:bg-gray-100`;
    }
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('astraEngageFirstVisit', 'false');
  };

  // Check if it's user's first visit
  useEffect(() => {
    const firstVisit = localStorage.getItem('astraEngageFirstVisit');
    if (firstVisit === 'false') {
      setShowWelcomeModal(false);
    }
  }, []);

  // Main content based on active panel
  const renderMainContent = () => {
    const commonProps = {
      selectedProposal,
      onProposalSelect: setSelectedProposal,
      proposals
    };

    switch (activePanel) {
      case 'map':
        return <CivicMap {...commonProps} />;
      case 'proposals':
        return <ProposalEngine {...commonProps} />;
      case 'dialogue':
        return <DialogueOrchestrator {...commonProps} />;
      case 'impact':
        return <ImpactTracker {...commonProps} />;
      default:
        return <CivicMap {...commonProps} />;
    }
  };

  // Add a new proposal (mock function)
  const handleAddProposal = () => {
    const newProposal = {
      id: proposals.length + 1,
      title: "New Community Green Space",
      problem: "Community requests more recreational areas",
      solution: "Convert vacant lot into community garden and park",
      status: "draft",
      supporters: 0,
      needed: 500,
      type: "green",
      location: [-73.95, 40.72],
      nasaData: {
        vegetationDeficit: 0.3,
        communityRequest: true
      }
    };
    setProposals([...proposals, newProposal]);
    setSelectedProposal(newProposal);
    setActivePanel('proposals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Satellite className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  ASTRA Engage
                </span>
              </div>
              <span className="hidden sm:inline px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Beta
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={getColorClasses(item.color, activePanel === item.id)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
              >
                {isSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Welcome!</p>
                  <p className="text-xs text-gray-500">Join the conversation</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  Y
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-3">
            <div className="flex space-x-1 overflow-x-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={getMobileColorClasses(item.color, activePanel === item.id)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex gap-6 transition-all duration-300 ${
          isSidebarOpen ? 'lg:flex-row flex-col' : 'flex-col'
        }`}>
          
          {/* Main Content Panel */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all ${
            isSidebarOpen ? 'flex-1' : 'w-full'
          }`} style={{ minHeight: '600px' }}>
            {renderMainContent()}
          </div>

          {/* Sidebar */}
          {isSidebarOpen && (
            <div className="lg:w-96 flex flex-col space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActivePanel('dialogue')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Report an Issue</span>
                  </button>
                  <button 
                    onClick={handleAddProposal}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Suggest Improvement</span>
                  </button>
                  <button 
                    onClick={() => setActivePanel('impact')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">View Impact</span>
                  </button>
                </div>
              </div>

              {/* Live Updates Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Live Updates</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  {liveUpdates.map(update => (
                    <div key={update.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 animate-pulse ${
                        update.type === 'nasa' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{update.title}</p>
                        <p className="text-xs text-gray-500">{update.timestamp} • {update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Proposals Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Active Proposals</h3>
                <div className="space-y-3">
                  {proposals.slice(0, 2).map(proposal => (
                    <div 
                      key={proposal.id}
                      onClick={() => {
                        setSelectedProposal(proposal);
                        setActivePanel('proposals');
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {proposal.type === 'heat' ? (
                          <Thermometer className="w-4 h-4 text-red-500" />
                        ) : (
                          <Trees className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-xs font-medium text-gray-500 uppercase">{proposal.type}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{proposal.title}</h4>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{proposal.supporters} supporters</span>
                        <span>{Math.round((proposal.supporters / proposal.needed) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (proposal.supporters / proposal.needed) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Proposal Card */}
              {selectedProposal && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-orange-800 bg-orange-100 px-2 py-1 rounded-full">
                      Featured Proposal
                    </span>
                    <button 
                      onClick={() => setSelectedProposal(null)}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedProposal.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{selectedProposal.solution}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>🔥 {selectedProposal.nasaData.temperatureAnomaly}°C above average</span>
                    <span>👥 {selectedProposal.supporters} supporters</span>
                  </div>
                  <button 
                    onClick={() => setActivePanel('proposals')}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden z-40">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`p-3 rounded-xl transition-all ${
                  activePanel === item.id
                    ? getMobileButtonColor(item.color, true)
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Modal for First-time Users */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-fade-in">
            <div className="text-center mb-6">
              <Satellite className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to ASTRA Engage</h3>
              <p className="text-gray-600">Help shape your city's future using NASA data and community insights</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Map className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Explore real-time city data</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Join community discussions</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Track your impact</span>
              </div>
            </div>

            <button 
              onClick={handleGetStarted}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}

      {/* Add some custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Helper function for mobile button colors
const getMobileButtonColor = (color, isActive) => {
  if (!isActive) return '';
  
  switch (color) {
    case 'blue': return 'bg-blue-100 text-blue-700';
    case 'green': return 'bg-green-100 text-green-700';
    case 'purple': return 'bg-purple-100 text-purple-700';
    case 'orange': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default Engage;
