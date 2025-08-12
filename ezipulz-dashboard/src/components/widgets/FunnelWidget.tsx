import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import './FunnelWidget.css';

interface FunnelData {
  stage: string;
  value: number;
  cases: number;
  percentage?: number;
}

interface FunnelWidgetProps {
  data?: any;
  title?: string;
  showValues?: boolean;
  showPercentages?: boolean;
  height?: number;
  onRefresh?: () => Promise<FunnelData[]>;
}

export const FunnelWidget: React.FC<FunnelWidgetProps> = ({
  data: propData,
  title = 'Pipeline Funnel',
  showValues = true,
  showPercentages = true,
  height = 400,
  onRefresh
}) => {
  const initialData = propData?.stages || propData || [];
  const [data, setData] = useState<FunnelData[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Calculate percentages
      const maxValue = Math.max(...initialData.map((d: any) => d.value));
      const processedData = initialData.map((item: any) => ({
        ...item,
        percentage: Math.round((item.value / maxValue) * 100)
      }));
      setData(processedData);
    }
  }, [initialData]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        const newData = await onRefresh();
        const maxValue = Math.max(...newData.map(d => d.value));
        const processedData = newData.map(item => ({
          ...item,
          percentage: Math.round((item.value / maxValue) * 100)
        }));
        setData(processedData);
      } catch (error) {
        console.error('Failed to refresh funnel:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value: number): string => {
    if (!value && value !== 0) return '$0';
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
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
          type: 'bar' as const,
          xKey: 'stage',
          yKey: 'value',
          fill: '#8b5cf6',
          fillOpacity: 0.8,
          strokeWidth: 0,
          label: {
            enabled: showValues,
            formatter: (params: any) => formatCurrency(params.value),
            placement: 'inside',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 12,
          },
          tooltip: {
            renderer: (params: any) => {
              const datum = params.datum;
              return {
                title: datum.stage,
                content: `
                  <div style="padding: 8px;">
                    <div><strong>Value:</strong> ${formatCurrency(datum.value)}</div>
                    <div><strong>Cases:</strong> ${datum.cases}</div>
                    <div><strong>Percentage:</strong> ${datum.percentage}%</div>
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
          line: {
            enabled: false,
          },
          tick: {
            enabled: false,
          },
        } as any,
        {
          type: 'number',
          position: 'left',
          label: {
            formatter: (params: any) => formatCurrency(params.value),
            fontSize: 10,
            color: '#64748b',
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
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
      legend: {
        enabled: false,
      },
    } as any;
  };

  return (
    <div className="funnel-widget">
      <div className="funnel-header">
        <h3 className="funnel-title">{title}</h3>
        <div className="funnel-stats">
          <div className="stat-item">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">
              {formatCurrency(data.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Cases</span>
            <span className="stat-value">
              {data.reduce((sum, item) => sum + item.cases, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="funnel-visualization">
        {data.map((stage, index) => (
          <div key={stage.stage} className="funnel-stage">
            <div 
              className="funnel-bar" 
              style={{ 
                width: `${stage.percentage}%`,
                opacity: 1 - (index * 0.15)
              }}
            >
              <div className="funnel-bar-content">
                <span className="stage-name">{stage.stage}</span>
                <span className="stage-value">{formatCurrency(stage.value)}</span>
                <span className="stage-cases">{stage.cases} cases</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="funnel-chart">
        <ChartWrapper
          title=""
          options={getChartOptions()}
          height={height}
          loading={loading}
          showRefreshButton={!!onRefresh}
          onRefresh={handleRefresh}
          priority="high"
        />
      </div>
    </div>
  );
};