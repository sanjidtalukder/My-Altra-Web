import React, { useState, useRef, useEffect } from 'react';
import CivicMap from './CivicMap';

import ImpactTracker from './ImpactTracker';
import DemocracyPulse from './DemocracyPulse';
import { useNASAData } from '../hooks/useNASAData';
import { useWebSocket } from '../hooks/useWebSocket';
import { 
  MapIcon, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Satellite,
  Thermometer,
  Droplets
} from 'lucide-react';
import ProposalEngine from './ProposalEngine';

const CivicEngagementPlatform = () => {
  const [activeView, setActiveView] = useState('map');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [dataLayers, setDataLayers] = useState({
    heat: true,
    vegetation: false,
    flood: false,
    sentiment: true
  });
  
  const { nasaData, loading: nasaLoading } = useNASAData();
  const { messages, sendMessage } = useWebSocket();

  const navigationItems = [
    { id: 'map', label: 'City Canvas', icon: MapIcon, color: 'blue' },
    { id: 'proposals', label: 'Proposals', icon: MessageSquare, color: 'green' },
    { id: 'pulse', label: 'Democracy Pulse', icon: BarChart3, color: 'purple' },
    { id: 'impact', label: 'My Impact', icon: Users, color: 'orange' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Satellite className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  ASTRA Civic Platform
                </h1>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full">
                Synaptic Democracy v1.0
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Data Layer Controls */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                    dataLayers.heat 
                      ? 'bg-red-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setDataLayers(prev => ({...prev, heat: !prev.heat}))}
                >
                  <Thermometer className="w-4 h-4" />
                  <span>Heat</span>
                </button>
                <button
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                    dataLayers.vegetation 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setDataLayers(prev => ({...prev, vegetation: !prev.vegetation}))}
                >
                  <Droplets className="w-4 h-4" />
                  <span>Vegetation</span>
                </button>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Maria Rodriguez</p>
                  <p className="text-xs text-gray-500">Impact Score: 1,240</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-6 border-t border-gray-200">
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeView === item.id
                    ? `border-${item.color}-500 text-${item.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map/Content Area (70%) */}
        <div className="flex-1 relative">
          {activeView === 'map' && (
            <CivicMap 
              dataLayers={dataLayers}
              nasaData={nasaData}
              onProposalSelect={setSelectedProposal}
              selectedProposal={selectedProposal}
            />
          )}
          {activeView === 'pulse' && <DemocracyPulse />}
          {activeView === 'impact' && <ImpactTracker />}
        </div>

        {/* Sidebar (30%) */}
        <div className="w-[30%] min-w-[400px] bg-white border-l border-gray-200 flex flex-col">
          {activeView === 'map' || activeView === 'proposals' ? (
            <>
              <ProposalEngine 
                selectedProposal={selectedProposal}
                onProposalSelect={setSelectedProposal}
              />
              <DialogueOrchestrator 
                proposal={selectedProposal}
                onMessageSend={sendMessage}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CivicEngagementPlatform;