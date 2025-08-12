import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import './RadarWidget.css';

interface RadarMetric {
  axis: string;
  value: number;
  target?: number;
  maxValue?: number;
}

interface RadarWidgetProps {
  data?: any;
  title?: string;
  metrics?: RadarMetric[];
  showTarget?: boolean;
  height?: number;
  centerScore?: number;
  centerLabel?: string;
  onRefresh?: () => Promise<RadarMetric[]>;
}

export const RadarWidget: React.FC<RadarWidgetProps> = ({
  data: propData,
  title = 'Business Health Score',
  metrics: initialMetrics,
  showTarget = true,
  height = 350,
  centerScore,
  centerLabel,
  onRefresh
}) => {
  const dataMetrics = propData?.metrics || initialMetrics || [];
  const [metrics, setMetrics] = useState<RadarMetric[]>(dataMetrics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propData) {
      const radarMetrics = propData.metrics || propData;
      if (Array.isArray(radarMetrics)) {
        setMetrics(radarMetrics);
      }
    } else if (initialMetrics) {
      setMetrics(initialMetrics);
    }
  }, [propData, initialMetrics]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        const newMetrics = await onRefresh();
        setMetrics(newMetrics);
      } catch (error) {
        console.error('Failed to refresh radar:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getChartOptions = (): AgChartOptions => {
    const actualData = metrics.map(m => ({
      axis: m.axis,
      value: m.value,
      series: 'Actual'
    }));

    const targetData = showTarget ? metrics.map(m => ({
      axis: m.axis,
      value: m.target || m.maxValue || 100,
      series: 'Target'
    })) : [];

    const allData = [...actualData, ...targetData];

    return {
      theme: 'ag-default-dark',
      background: {
        fill: 'transparent',
      },
      data: allData,
      series: [
        {
          type: 'radar-line' as any,
          angleKey: 'axis',
          radiusKey: 'value',
          radiusName: 'Actual',
          stroke: '#0ea5e9',
          strokeWidth: 2,
          fill: '#0ea5e9',
          fillOpacity: 0.2,
          marker: {
            enabled: true,
            shape: 'circle',
            size: 8,
            fill: '#0ea5e9',
            stroke: '#1e1e2e',
            strokeWidth: 2,
          },
          tooltip: {
            renderer: (params: any) => {
              const datum = params.datum;
              const metric = metrics.find(m => m.axis === datum.axis);
              return {
                title: datum.axis,
                content: `
                  <div style="padding: 8px;">
                    <div><strong>Value:</strong> ${datum.value}</div>
                    ${metric?.target ? `<div><strong>Target:</strong> ${metric.target}</div>` : ''}
                    <div><strong>Performance:</strong> ${metric?.target ? 
                      Math.round((datum.value / metric.target) * 100) : datum.value}%</div>
                  </div>
                `,
              };
            },
          },
        } as any,
        ...(showTarget && targetData.length > 0 ? [{
          type: 'radar-line' as any,
          angleKey: 'axis',
          radiusKey: 'value',
          radiusName: 'Target',
          stroke: '#64748b',
          strokeWidth: 1,
          strokeOpacity: 0.5,
          fill: 'transparent',
          lineDash: [4, 4],
          marker: {
            enabled: false,
          },
        } as any] : []),
      ],
      axes: [
        {
          type: 'angle-category',
          shape: 'polygon',
          label: {
            fontSize: 11,
            color: '#94a3b8',
          },
          gridLine: {
            enabled: true,
            style: [
              {
                stroke: 'rgba(255, 255, 255, 0.1)',
                lineDash: [2, 2],
              },
            ],
          },
        } as any,
        {
          type: 'radius-number',
          shape: 'polygon',
          label: {
            enabled: false,
          },
          gridLine: {
            enabled: true,
            style: [
              {
                stroke: 'rgba(255, 255, 255, 0.05)',
                lineDash: [2, 2],
              },
            ],
          },
        } as any,
      ],
      padding: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
      },
      legend: {
        enabled: false,
      },
    } as any;
  };

  const calculateOverallScore = () => {
    if (metrics.length === 0) return 0;
    
    const totalScore = metrics.reduce((sum, metric) => {
      const maxVal = metric.target || metric.maxValue || 100;
      const percentage = (metric.value / maxVal) * 100;
      return sum + Math.min(percentage, 100);
    }, 0);
    
    return Math.round(totalScore / metrics.length);
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  };

  const score = centerScore !== undefined ? centerScore : calculateOverallScore();
  const status = getScoreStatus(score);

  return (
    <div className="radar-widget">
      <div className="radar-header">
        <h3 className="radar-title">{title}</h3>
        <div className={`radar-score ${status}`}>
          <span className="score-value">{score}</span>
          <span className="score-label">{centerLabel || 'Overall Score'}</span>
        </div>
      </div>

      <div className="radar-chart-container">
        <ChartWrapper
          title=""
          options={getChartOptions()}
          height={height}
          loading={loading}
          showRefreshButton={!!onRefresh}
          onRefresh={handleRefresh}
          priority="high"
        />
        
        {centerScore !== undefined && (
          <div className="radar-center">
            <div className={`center-score ${status}`}>
              <span className="score-number">{score}</span>
              <span className="score-percent">%</span>
            </div>
            <div className="center-status">{status.toUpperCase()}</div>
          </div>
        )}
      </div>

      <div className="radar-metrics">
        {metrics.map((metric, index) => (
          <div key={metric.axis} className="metric-item">
            <span className="metric-name">{metric.axis}</span>
            <div className="metric-bar">
              <div 
                className="metric-fill"
                style={{ 
                  width: `${Math.min((metric.value / (metric.target || metric.maxValue || 100)) * 100, 100)}%`,
                  backgroundColor: `hsl(${120 * (metric.value / (metric.target || 100))}, 70%, 50%)`
                }}
              />
            </div>
            <span className="metric-value">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};