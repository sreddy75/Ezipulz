import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import './HeatmapWidget.css';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatmapWidgetProps {
  data?: any;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  colorScheme?: 'green-red' | 'blue-red' | 'purple-orange';
  onRefresh?: () => Promise<HeatmapData[]>;
}

export const HeatmapWidget: React.FC<HeatmapWidgetProps> = ({
  data: propData,
  title = 'Processing Time Heatmap',
  xLabel = 'Day of Week',
  yLabel = 'Hour of Day',
  height = 400,
  colorScheme = 'green-red',
  onRefresh
}) => {
  const initialData = propData?.data || propData || [];
  const [data, setData] = useState<HeatmapData[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propData) {
      const heatmapData = propData.data || propData;
      if (Array.isArray(heatmapData)) {
        setData(heatmapData);
      }
    }
  }, [propData]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        const newData = await onRefresh();
        setData(newData);
      } catch (error) {
        console.error('Failed to refresh heatmap:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getColorScale = () => {
    switch (colorScheme) {
      case 'blue-red':
        return ['#0ea5e9', '#8b5cf6', '#f43f5e'];
      case 'purple-orange':
        return ['#8b5cf6', '#a855f7', '#f59e0b'];
      default:
        return ['#10b981', '#f59e0b', '#f43f5e'];
    }
  };

  const getChartOptions = (): AgChartOptions => {
    // Get unique x and y values
    const xSet = new Set(data.map(d => d.x));
    const ySet = new Set(data.map(d => d.y));
    const xValues = Array.from(xSet);
    const yValues = Array.from(ySet);
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));

    return {
      theme: 'ag-default-dark',
      background: {
        fill: 'transparent',
      },
      data: data,
      series: [
        {
          type: 'heatmap' as any,
          xKey: 'x',
          yKey: 'y',
          colorKey: 'value',
          colorDomain: [minValue, (minValue + maxValue) / 2, maxValue],
          colorRange: getColorScale(),
          label: {
            enabled: true,
            formatter: (params: any) => params.datum.label || params.datum.value.toFixed(1),
            color: '#ffffff',
            fontSize: 10,
          },
          tooltip: {
            renderer: (params: any) => {
              const datum = params.datum;
              return {
                title: `${datum.x} - ${datum.y}`,
                content: `
                  <div style="padding: 8px;">
                    <div><strong>Value:</strong> ${datum.value.toFixed(1)}</div>
                    ${datum.label ? `<div><strong>Status:</strong> ${datum.label}</div>` : ''}
                  </div>
                `,
              };
            },
          },
        } as any,
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          label: {
            fontSize: 11,
            color: '#94a3b8',
          },
          title: {
            text: xLabel,
            fontSize: 12,
            color: '#64748b',
          },
          line: {
            enabled: false,
          },
          tick: {
            enabled: false,
          },
        } as any,
        {
          type: 'category',
          position: 'left',
          label: {
            fontSize: 11,
            color: '#94a3b8',
          },
          title: {
            text: yLabel,
            fontSize: 12,
            color: '#64748b',
          },
          line: {
            enabled: false,
          },
          tick: {
            enabled: false,
          },
        } as any,
      ],
      padding: {
        top: 20,
        right: 60,
        bottom: 40,
        left: 60,
      },
      legend: {
        enabled: true,
        position: 'right',
        item: {
          paddingX: 8,
          paddingY: 8,
        },
      },
    } as any;
  };

  const getStatistics = () => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return { min, max, avg };
  };

  const stats = getStatistics();

  return (
    <div className="heatmap-widget">
      <div className="heatmap-header">
        <h3 className="heatmap-title">{title}</h3>
        <div className="heatmap-stats">
          <div className="stat-item">
            <span className="stat-label">Min</span>
            <span className="stat-value min">{stats.min.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg</span>
            <span className="stat-value avg">{stats.avg.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max</span>
            <span className="stat-value max">{stats.max.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <ChartWrapper
        title=""
        options={getChartOptions()}
        height={height}
        loading={loading}
        showRefreshButton={!!onRefresh}
        onRefresh={handleRefresh}
        priority="medium"
      />

      <div className="heatmap-legend-info">
        <span className="legend-info-text">
          Darker colors indicate longer processing times
        </span>
      </div>
    </div>
  );
};