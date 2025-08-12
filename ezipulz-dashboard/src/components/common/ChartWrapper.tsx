import React, { useEffect, useRef, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import './ChartWrapper.css';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  options: AgChartOptions;
  height?: number | string;
  className?: string;
  loading?: boolean;
  error?: string;
  updateInterval?: number;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  options,
  height = 300,
  className = '',
  loading = false,
  error,
  updateInterval,
  onRefresh,
  showRefreshButton = false,
  priority = 'medium'
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (updateInterval && onRefresh) {
      intervalRef.current = setInterval(() => {
        setIsUpdating(true);
        onRefresh();
        setTimeout(() => setIsUpdating(false), 500);
      }, updateInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [updateInterval, onRefresh]);

  const handleRefresh = () => {
    if (onRefresh) {
      setIsUpdating(true);
      onRefresh();
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  const getPriorityClass = () => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className={`chart-wrapper ${className} ${getPriorityClass()} ${isUpdating ? 'updating' : ''}`}>
      <div className="chart-header">
        <div className="chart-title-group">
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        <div className="chart-controls">
          {isUpdating && (
            <span className="update-indicator">
              <span className="pulse"></span>
              Updating...
            </span>
          )}
          {showRefreshButton && onRefresh && (
            <button 
              className="refresh-button" 
              onClick={handleRefresh}
              disabled={isUpdating}
              aria-label="Refresh chart"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="chart-content" style={{ height }}>
        {loading && (
          <div className="chart-loading">
            <div className="spinner"></div>
            <p>Loading chart data...</p>
          </div>
        )}

        {error && (
          <div className="chart-error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>{error}</p>
            {onRefresh && (
              <button onClick={handleRefresh} className="retry-button">
                Retry
              </button>
            )}
          </div>
        )}

        {!loading && !error && (
          <AgCharts options={options} />
        )}
      </div>
    </div>
  );
};