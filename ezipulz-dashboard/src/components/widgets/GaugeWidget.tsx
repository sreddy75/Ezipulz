import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import './GaugeWidget.css';

interface GaugeWidgetProps {
  data?: any;
  title: string;
  value?: number;
  target?: number;
  min?: number;
  max?: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage';
  thresholds?: {
    good: number;
    warning: number;
    critical: number;
  };
  inverse?: boolean; // For metrics where lower is better
  subtitle?: string;
  onRefresh?: () => Promise<number>;
}

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({
  data,
  title,
  value: initialValue,
  target: propTarget,
  min = 0,
  max = 100,
  unit = '',
  format = 'number',
  thresholds,
  inverse = false,
  subtitle,
  onRefresh
}) => {
  // Extract values from data prop if provided
  const dataValue = data?.value ?? initialValue ?? 0;
  const target = data?.target ?? propTarget ?? 100;
  const [value, setValue] = useState(dataValue);
  const [loading, setLoading] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    setValue(dataValue);
  }, [dataValue]);

  useEffect(() => {
    // Animate value on mount and changes
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = (value - animatedValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedValue(prev => prev + increment);
      } else {
        clearInterval(timer);
        setAnimatedValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        const newValue = await onRefresh();
        setValue(newValue);
      } catch (error) {
        console.error('Failed to refresh gauge:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatValue = (val: number): string => {
    if (!val && val !== 0) val = 0;
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return `${val.toLocaleString()}${unit}`;
    }
  };

  const getStatus = (): 'good' | 'warning' | 'critical' => {
    if (!thresholds) {
      // Default logic based on target
      const percentage = (value / target) * 100;
      if (inverse) {
        if (percentage <= 100) return 'good';
        if (percentage <= 120) return 'warning';
        return 'critical';
      } else {
        if (percentage >= 80) return 'good';
        if (percentage >= 60) return 'warning';
        return 'critical';
      }
    }

    if (inverse) {
      if (value <= thresholds.good) return 'good';
      if (value <= thresholds.warning) return 'warning';
      return 'critical';
    } else {
      if (value >= thresholds.good) return 'good';
      if (value >= thresholds.warning) return 'warning';
      return 'critical';
    }
  };

  const getChartOptions = (): AgChartOptions => {
    const normalizedValue = ((animatedValue - min) / (max - min)) * 100;

    return {
      theme: 'ag-default-dark',
      background: {
        fill: 'transparent',
      },
      data: [
        { category: 'Value', value: normalizedValue, type: 'actual' },
        { category: 'Remaining', value: 100 - normalizedValue, type: 'remaining' }
      ],
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          categoryKey: 'category',
          innerRadiusRatio: 0.7,
          fills: [getStatusColor(), 'rgba(255, 255, 255, 0.05)'],
          strokes: ['transparent', 'transparent'],
          highlightStyle: {
            item: {
              fillOpacity: 1,
              strokeOpacity: 0,
            },
          },
          tooltip: {
            enabled: false,
          },
        } as any,
      ],
      legend: {
        enabled: false,
      },
    } as any;
  };

  const getStatusColor = (): string => {
    const status = getStatus();
    switch (status) {
      case 'good':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#f43f5e';
      default:
        return '#64748b';
    }
  };

  const getPercentage = (): number => {
    return Math.round((value / target) * 100);
  };

  return (
    <div className={`gauge-widget ${getStatus()}`}>
      <div className="gauge-header">
        <h3 className="gauge-title">{title}</h3>
        {subtitle && <p className="gauge-subtitle">{subtitle}</p>}
      </div>

      <div className="gauge-chart-container">
        <ChartWrapper
          title=""
          options={getChartOptions()}
          height={200}
          loading={loading}
          showRefreshButton={false}
          className="gauge-chart"
        />
        
        <div className="gauge-center">
          <div className="gauge-value">{formatValue(Math.round(animatedValue))}</div>
          <div className="gauge-target">Target: {formatValue(target)}</div>
          <div className="gauge-percentage">{getPercentage()}%</div>
        </div>
      </div>

      <div className="gauge-footer">
        <div className="gauge-legend">
          <div className="legend-item">
            <span className="legend-dot actual"></span>
            <span className="legend-label">Current</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot target"></span>
            <span className="legend-label">Target</span>
          </div>
        </div>
        
        <div className={`gauge-status ${getStatus()}`}>
          <span className="status-indicator"></span>
          <span className="status-text">{getStatus().toUpperCase()}</span>
        </div>
      </div>

      {onRefresh && (
        <button className="gauge-refresh" onClick={handleRefresh} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};