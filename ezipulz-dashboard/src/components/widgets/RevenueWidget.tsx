import React, { useEffect, useState } from 'react';
import { AgChartOptions } from 'ag-charts-community';
import { ChartWrapper } from '../common/ChartWrapper';
import { dataService } from '../../services/DataService';
import './RevenueWidget.css';

interface RevenueData {
  total: number;
  change: number;
  trend: string;
  history: Array<{ date: string; value: number }>;
  nwnf: number;
  defence: number;
}

interface RevenueWidgetProps {
  data?: any;
  title?: string;
}

export const RevenueWidget: React.FC<RevenueWidgetProps> = ({ data: propData, title: propTitle }) => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(propData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getRevenue();
      setRevenueData(data);
    } catch (err) {
      setError('Failed to load revenue data');
      console.error('Revenue widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propData) {
      // Use provided data directly
      const formattedData: RevenueData = {
        total: propData.current || 0,
        change: propData.change || 0,
        trend: propData.trend ? 'up' : 'down',
        history: propData.trend || [],
        nwnf: propData.nwnf || 0,
        defence: propData.defence || 0
      };
      setRevenueData(formattedData);
      setLoading(false);
    } else {
      loadData();

    // Subscribe to WebSocket updates
    const unsubscribe = dataService.subscribe('update', (data: any) => {
      if (data.type === 'revenue') {
        setRevenueData(data.payload);
      }
    });

    return () => {
      unsubscribe();
    };
    }
  }, [propData]);

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
    if (!revenueData?.history) {
      return {} as any;
    }

    return {
      theme: 'ag-default-dark',
      background: {
        fill: 'transparent',
      },
      data: revenueData.history.slice(-30), // Last 30 days
      series: [
        {
          type: 'line',
          xKey: 'date',
          yKey: 'value',
          stroke: '#0ea5e9',
          strokeWidth: 2,
          marker: {
            enabled: false,
          },
          tooltip: {
            renderer: (params: any) => {
              return {
                content: `${new Date(params.datum.date).toLocaleDateString()}: ${formatCurrency(params.datum.value)}`,
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
            enabled: false,
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
            enabled: false,
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
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      legend: {
        enabled: false,
      },
    } as any;
  };

  const getTrendIcon = () => {
    if (!revenueData) return null;
    
    if (revenueData.trend === 'up') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M23 6l-9.5 9.5-5-5L1 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 6h6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (revenueData.trend === 'down') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M23 18l-9.5-9.5-5 5L1 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 18h6v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="revenue-widget">
      <div className="revenue-header">
        <div className="revenue-value-section">
          <h2 className="revenue-title">Total Revenue</h2>
          <div className="revenue-value">
            {loading ? (
              <div className="skeleton-text"></div>
            ) : (
              <span className="value-text">{formatCurrency(revenueData?.total || 0)}</span>
            )}
          </div>
          {revenueData && (
            <div className={`revenue-change ${revenueData.trend}`}>
              {getTrendIcon()}
              <span>{Math.abs(revenueData.change)}%</span>
              <span className="change-label">vs last month</span>
            </div>
          )}
        </div>
        
        {revenueData && (
          <div className="revenue-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">NWNF</span>
              <span className="breakdown-value">{formatCurrency(revenueData.nwnf || 0)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Defence</span>
              <span className="breakdown-value">{formatCurrency(revenueData.defence || 0)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="revenue-chart">
        <ChartWrapper
          title=""
          options={getChartOptions()}
          height={120}
          loading={loading}
          error={error || undefined}
          onRefresh={loadData}
          showRefreshButton={false}
          priority="high"
        />
      </div>
    </div>
  );
};