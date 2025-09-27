// src/hooks/useCivicSocket.js
import { useState, useEffect } from 'react';

export const useCivicSocket = () => {
  const [socket, setSocket] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState([]);

  useEffect(() => {
    // Simulate WebSocket connection
    const mockSocket = {
      on: (event, callback) => {
        // Mock real-time updates
        if (event === 'proposalUpdate') {
          setInterval(() => {
            callback({
              type: 'vote',
              proposalId: 1,
              newVotes: Math.floor(Math.random() * 10),
              timestamp: new Date()
            });
          }, 5000);
        }
      },
      emit: (event, data) => {
        console.log('Emitting:', event, data);
      }
    };

    setSocket(mockSocket);
  }, []);

  return { socket, liveUpdates };
};
