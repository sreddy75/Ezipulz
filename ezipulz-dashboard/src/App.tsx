import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/layout/Dashboard';
import { dataService } from './services/DataService';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    try {
      dataService.connectWebSocket();
      
      // Subscribe to connection status
      const unsubscribe = dataService.subscribe('connection', (data: any) => {
        setIsConnected(data.status === 'connected');
        if (data.status === 'disconnected') {
          setConnectionError('Connection lost. Attempting to reconnect...');
        } else {
          setConnectionError(null);
        }
      });

      return () => {
        unsubscribe();
        dataService.disconnectWebSocket();
      };
    } catch (error) {
      console.error('Failed to initialize connection:', error);
      setConnectionError('Failed to connect to server');
    }
  }, []);

  return (
    <Router>
      <div className="app">
        {connectionError && (
          <div className="connection-banner">
            <span className="connection-message">{connectionError}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="reconnect-button"
            >
              Reconnect
            </button>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
