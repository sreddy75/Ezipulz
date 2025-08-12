import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import './DonutWidget.css';

interface DonutData {
  category: string;
  value: number;
  percentage?: number;
  color?: string;
}

interface DonutWidgetProps {
  title?: string;
  data?: any;
  centerValue?: string | number;
  centerLabel?: string;
  height?: number;
  showLegend?: boolean;
  onRefresh?: () => Promise<DonutData[]>;
}

export const DonutWidget: React.FC<DonutWidgetProps> = ({
  title = 'Active Cases Distribution',
  data: propData,
  centerValue,
  centerLabel,
  height = 300,
  showLegend = true,
  onRefresh
}) => {
  // Process prop data to extract distribution
  const initialData = propData?.distribution || propData || [];
  const [data, setData] = useState<DonutData[]>(initialData);
  const [loading, setLoading] = useState(false);

  const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

  useEffect(() => {
    if (propData) {
      const distData = propData.distribution || propData;
      if (Array.isArray(distData)) {
        const total = distData.reduce((sum: number, item: any) => sum + item.value, 0);
        const processedData = distData.map((item: any, index: number) => ({
        ...item,
        percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
        color: item.color || defaultColors[index % defaultColors.length]
      }));
        setData(processedData);
      }
    }
  }, [propData, defaultColors]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        const newData = await onRefresh();
        const total = newData.reduce((sum, item) => sum + item.value, 0);
        const processedData = newData.map((item, index) => ({
          ...item,
          percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
          color: item.color || defaultColors[index % defaultColors.length]
        }));
        setData(processedData);
      } catch (error) {
        console.error('Failed to refresh donut:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getChartOptions = (): AgChartOptions => {
    return {
      theme: 'ag-default-dark',
      background: {
        fill: 'transparent',
      },
      data: data,
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          categoryKey: 'category',
          innerRadiusRatio: 0.6,
          fills: data.map(d => d.color || '#64748b'),
          strokes: data.map(() => '#1e1e2e'),
          strokeWidth: 2,
          highlightStyle: {
            item: {
              fillOpacity: 0.8,
              stroke: '#2a2a3e',
              strokeWidth: 3,
            },
          },
          label: {
            enabled: false,
          },
          tooltip: {
            renderer: (params: any) => {
              const datum = params.datum;
              const percentage = data.find(d => d.category === datum.category)?.percentage || 0;
              return {
                title: datum.category,
                content: `
                  <div style="padding: 8px;">
                    <div><strong>Cases:</strong> ${datum.value}</div>
                    <div><strong>Percentage:</strong> ${percentage}%</div>
                  </div>
                `,
              };
            },
          },
        } as any,
      ],
      legend: {
        enabled: false,
      },
    } as any;
  };

  const getTotalValue = () => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  return (
    <div className="donut-widget">
      <div className="donut-header">
        <h3 className="donut-title">{title}</h3>
      </div>

      <div className="donut-container">
        <div className="donut-chart-wrapper">
          <ChartWrapper
            title=""
            options={getChartOptions()}
            height={height}
            loading={loading}
            showRefreshButton={!!onRefresh}
            onRefresh={handleRefresh}
            priority="medium"
          />
          
          <div className="donut-center">
            <div className="center-value">{centerValue || getTotalValue()}</div>
            <div className="center-label">{centerLabel || 'Total Cases'}</div>
          </div>
        </div>

        {showLegend && (
          <div className="donut-legend">
            {data.map((item, index) => (
              <div key={item.category} className="legend-item">
                <span 
                  className="legend-dot" 
                  style={{ backgroundColor: item.color || defaultColors[index % defaultColors.length] }}
                ></span>
                <div className="legend-content">
                  <span className="legend-label">{item.category}</span>
                  <span className="legend-value">{item.value} ({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};