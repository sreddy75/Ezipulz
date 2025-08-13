import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import './WaterfallWidget.css';

interface WaterfallData {
  category: string;
  value: number;
  type: 'increase' | 'decrease' | 'total';
  cumulative?: number;
}

interface WaterfallWidgetProps {
  data?: any;
  title?: string;
  height?: number;
  showCumulative?: boolean;
  onRefresh?: () => Promise<WaterfallData[]>;
}

export const WaterfallWidget: React.FC<WaterfallWidgetProps> = ({
  data: propData,
  title = 'Settlement Breakdown',
  height = 350,
  showCumulative = true,
  onRefresh
}) => {
  // Handle different data structures - look for data property or breakdown property
  const initialData = propData?.data || propData?.breakdown || propData || [];
  const [data, setData] = useState<WaterfallData[]>(Array.isArray(initialData) ? initialData : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawData = propData?.data || propData?.breakdown || propData || [];
    if (Array.isArray(rawData) && rawData.length > 0) {
      // Calculate cumulative values
      let cumulative = 0;
      const processedData = rawData.map((item: any) => {
        if (item.type === 'total') {
          return { ...item, cumulative };
        }
        cumulative += item.value;
        return { ...item, cumulative };
      });
      setData(processedData);
    }
  }, [propData]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        const newData = await onRefresh();
        let cumulative = 0;
        const processedData = newData.map(item => {
          if (item.type === 'total') {
            return { ...item, cumulative };
          }
          cumulative += item.value;
          return { ...item, cumulative };
        });
        setData(processedData);
      } catch (error) {
        console.error('Failed to refresh waterfall:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value: number): string => {
    if (!value && value !== 0) return '$0';
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getChartOptions = (): AgChartOptions => {
    const chartData = data.map((item, index) => {
      const prevCumulative = index > 0 ? data[index - 1].cumulative || 0 : 0;
      return {
        category: item.category,
        start: item.type === 'total' ? 0 : prevCumulative,
        end: item.cumulative || 0,
        value: item.value,
        type: item.type,
      };
    });

    return {
      theme: 'ag-default-dark',
      background: {
        fill: 'transparent',
      },
      data: chartData,
      series: [
        {
          type: 'bar' as const,
          xKey: 'category',
          yKey: 'end',
          yLowKey: 'start',
          fill: (params: any) => {
            const datum = params.datum;
            if (datum.type === 'increase') return '#10b981';
            if (datum.type === 'decrease') return '#f43f5e';
            return '#0ea5e9';
          },
          fillOpacity: 0.8,
          strokeWidth: 1,
          stroke: '#2a2a3e',
          label: {
            enabled: true,
            formatter: (params: any) => formatCurrency(params.datum.value),
            placement: 'inside',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 11,
          },
          tooltip: {
            renderer: (params: any) => {
              const datum = params.datum;
              return {
                title: datum.category,
                content: `
                  <div style="padding: 8px;">
                    <div><strong>Value:</strong> ${formatCurrency(datum.value)}</div>
                    <div><strong>Cumulative:</strong> ${formatCurrency(datum.end)}</div>
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
            rotation: -45,
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
        bottom: 40,
        left: 20,
      },
      legend: {
        enabled: false,
      },
    } as any;
  };

  const getTotalValue = () => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((sum, item) => {
      if (item.type !== 'total') {
        return sum + item.value;
      }
      return sum;
    }, 0);
  };

  return (
    <div className="waterfall-widget">
      <div className="waterfall-header">
        <h3 className="waterfall-title">{title}</h3>
        <div className="waterfall-total">
          <span className="total-label">Total Settlement Value</span>
          <span className="total-value">{formatCurrency(getTotalValue())}</span>
        </div>
      </div>

      <div className="waterfall-legend">
        <div className="legend-item">
          <span className="legend-dot increase"></span>
          <span className="legend-label">SOC</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot increase"></span>
          <span className="legend-label">Mediation</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot increase"></span>
          <span className="legend-label">Trial</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot total"></span>
          <span className="legend-label">Total</span>
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
    </div>
  );
};