import React from 'react';
import './BulletWidget.css';

interface BulletItem {
  label: string;
  actual: number;
  target: number;
  ranges: {
    poor: number;
    satisfactory: number;
    good: number;
    excellent: number;
  };
}

interface BulletWidgetProps {
  data?: any;
  title?: string;
  height?: number;
  showLabels?: boolean;
}

export const BulletWidget: React.FC<BulletWidgetProps> = ({
  data: propData,
  title: propTitle,
  height = 300,
  showLabels = true
}) => {
  // Handle data as array of items
  const items: BulletItem[] = propData?.items || [];
  const title = propTitle || 'Targets';

  const formatValue = (value: number): string => {
    if (!value && value !== 0) return '0';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const getPerformanceStatus = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 100) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 70) return 'satisfactory';
    return 'poor';
  };

  const calculatePercentage = (value: number, max: number) => {
    return (value / max) * 100;
  };

  return (
    <div className="bullet-widget" style={{ height }}>
      <div className="bullet-header">
        <h3 className="bullet-title">{title}</h3>
        <div className="bullet-percentage">
          <span className="percentage-value">
            {items.length > 0 
              ? Math.round((items.reduce((sum, item) => sum + item.actual, 0) / 
                            items.reduce((sum, item) => sum + item.target, 0)) * 100)
              : 0}%
          </span>
          <span className="percentage-label">of target</span>
        </div>
      </div>
      
      <div className="bullet-visualization">
        {items.map((item, index) => {
          const maxValue = Math.max(item.ranges.excellent, item.target * 1.2, item.actual * 1.2);
          const status = getPerformanceStatus(item.actual, item.target);
          
          return (
            <div key={index} className="bullet-item">
              <div className="bullet-item-header">
                <span className="bullet-item-label">{item.label}</span>
                <span className="bullet-item-value">
                  {formatValue(item.actual)} / {formatValue(item.target)}
                </span>
              </div>
              
              <div className="bullet-bar-container">
                <div className="bullet-ranges">
                  <div 
                    className="range-poor" 
                    style={{ width: `${calculatePercentage(item.ranges.poor, maxValue)}%` }}
                  />
                  <div 
                    className="range-satisfactory" 
                    style={{ width: `${calculatePercentage(item.ranges.satisfactory - item.ranges.poor, maxValue)}%` }}
                  />
                  <div 
                    className="range-good" 
                    style={{ width: `${calculatePercentage(item.ranges.good - item.ranges.satisfactory, maxValue)}%` }}
                  />
                  <div 
                    className="range-excellent" 
                    style={{ width: `${calculatePercentage(item.ranges.excellent - item.ranges.good, maxValue)}%` }}
                  />
                </div>
                
                <div 
                  className="bullet-measure" 
                  style={{ width: `${calculatePercentage(item.actual, maxValue)}%` }}
                />
                
                <div 
                  className="bullet-target" 
                  style={{ left: `${calculatePercentage(item.target, maxValue)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {showLabels && (
        <div className="bullet-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(244, 63, 94, 0.3)' }} />
            <span className="legend-label">Poor</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(245, 158, 11, 0.3)' }} />
            <span className="legend-label">Satisfactory</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(14, 165, 233, 0.3)' }} />
            <span className="legend-label">Good</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'rgba(16, 185, 129, 0.3)' }} />
            <span className="legend-label">Excellent</span>
          </div>
        </div>
      )}
    </div>
  );
};