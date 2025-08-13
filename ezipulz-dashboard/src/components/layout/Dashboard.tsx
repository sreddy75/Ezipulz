import React, { useState, useEffect, useRef } from 'react';
import { ExecutivePage } from '../pages/ExecutivePage';
import { RevenuePage } from '../pages/RevenuePage';
import { OperationsPage } from '../pages/OperationsPage';
import { PerformancePage } from '../pages/PerformancePage';
import './Dashboard.css';

const pages = [
  { id: 'executive', name: 'Executive Summary', duration: 5000, path: '/dashboard/executive' },
  { id: 'revenue', name: 'Revenue Details', duration: 5000, path: '/dashboard/revenue' },
  { id: 'operations', name: 'Operations', duration: 5000, path: '/dashboard/operations' },
  { id: 'performance', name: 'Performance', duration: 5000, path: '/dashboard/performance' },
];

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [renderKey, setRenderKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    console.log('Dashboard: Current page changed to:', currentPage, 'Page name:', pages[currentPage]?.name);
  }, [currentPage]);

  useEffect(() => {
    // Update time every second
    timeIntervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const currentPageDuration = pages[currentPage].duration;
      
      intervalRef.current = setTimeout(() => {
        const nextPage = (currentPage + 1) % pages.length;
        console.log(`Dashboard: Auto-rotating to page ${nextPage}: ${pages[nextPage].name}`);
        setCurrentPage(nextPage);
      }, currentPageDuration);

      return () => {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
      };
    }
  }, [currentPage, isPaused]);

  useEffect(() => {
    // Initialize to first page on mount
    console.log('Dashboard: Initialized to first page');
  }, []);

  const handlePageClick = (index: number) => {
    console.log(`Dashboard: Manually navigating to page ${index}: ${pages[index].name}`);
    setCurrentPage(index);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-logo">EziPulz</h1>
          <span className="dashboard-subtitle">KPI Dashboard</span>
        </div>

        <div className="header-center">
          <div className="page-indicators">
            {pages.map((page, index) => (
              <button
                key={page.id}
                className={`page-indicator ${index === currentPage ? 'active' : ''}`}
                onClick={() => handlePageClick(index)}
                aria-label={`Go to ${page.name}`}
              >
                <span className="indicator-dot"></span>
                <span className="indicator-label">{page.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="header-right">
          <div className="datetime">
            <div className="time">{formatTime(currentTime)}</div>
            <div className="date">{formatDate(currentTime)}</div>
          </div>
          
          <button 
            className={`pause-button ${isPaused ? 'paused' : ''}`}
            onClick={togglePause}
            aria-label={isPaused ? 'Resume rotation' : 'Pause rotation'}
          >
            {isPaused ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {currentPage === 0 && <ExecutivePage key={`executive-${renderKey}`} />}
        {currentPage === 1 && <RevenuePage key={`revenue-${renderKey}`} />}
        {currentPage === 2 && <OperationsPage key={`operations-${renderKey}`} />}
        {currentPage === 3 && <PerformancePage key={`performance-${renderKey}`} />}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-left">
          <span className="connection-status connected">
            <span className="status-dot"></span>
            Connected
          </span>
        </div>
        
        <div className="footer-center">
          <span className="current-page">{pages[currentPage].name}</span>
        </div>
        
        <div className="footer-right">
          <span className="rotation-status">
            {isPaused ? 'Rotation Paused' : 'Auto-Rotating'}
          </span>
        </div>
      </footer>
    </div>
  );
};