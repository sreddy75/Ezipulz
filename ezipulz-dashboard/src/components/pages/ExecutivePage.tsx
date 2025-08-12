import React, { useEffect, useState } from 'react';
import { RevenueWidget } from '../widgets/RevenueWidget';
import { GaugeWidget } from '../widgets/GaugeWidget';
import { DonutWidget } from '../widgets/DonutWidget';
import { FunnelWidget } from '../widgets/FunnelWidget';
import { WaterfallWidget } from '../widgets/WaterfallWidget';
import { RadarWidget } from '../widgets/RadarWidget';
import { BulletWidget } from '../widgets/BulletWidget';
import { dataService } from '../../services/DataService';
import './ExecutivePage.css';

export const ExecutivePage: React.FC = () => {
  const [data, setData] = useState<any>({
    revenue: null,
    avgDays: null,
    activeCases: null,
    pipeline: null,
    settlement: null,
    health: null,
    satisfaction: null,
    compliance: null,
    targets: null
  });

  useEffect(() => {
    loadData();
    
    // Subscribe to updates
    const unsubscribe = dataService.subscribe('update', (updateData: any) => {
      // Handle real-time updates based on data type
      setData((prev: any) => ({
        ...prev,
        [updateData.type]: updateData.payload
      }));
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      console.log('ExecutivePage: Loading data with high revenue values');
      // Simulated data for all widgets
      setData({
        revenue: {
          current: 1250000,
          target: 1500000,
          trend: [
            { month: 'Jan', value: 950000 },
            { month: 'Feb', value: 1020000 },
            { month: 'Mar', value: 1150000 },
            { month: 'Apr', value: 850000 }
          ]
        },
        avgDays: {
          value: 42,
          target: 30,
          min: 0,
          max: 60
        },
        activeCases: {
          total: 1247,
          distribution: [
            { category: 'GST Returns', value: 450, percentage: 36 },
            { category: 'Company Registration', value: 320, percentage: 26 },
            { category: 'IPR Filing', value: 280, percentage: 22 },
            { category: 'Legal Notices', value: 197, percentage: 16 }
          ]
        },
        pipeline: {
          total: 3200000,
          stages: [
            { stage: 'Lead', value: 3200000, cases: 850, percentage: 100 },
            { stage: 'Qualified', value: 2400000, cases: 640, percentage: 75 },
            { stage: 'Proposal', value: 1600000, cases: 425, percentage: 50 },
            { stage: 'Negotiation', value: 800000, cases: 210, percentage: 25 },
            { stage: 'Closed Won', value: 320000, cases: 85, percentage: 10 }
          ]
        },
        settlement: {
          total: 850000,
          breakdown: [
            { category: 'Base Amount', value: 500000, type: 'start' },
            { category: 'Service Fees', value: 200000, type: 'increase' },
            { category: 'Additional Services', value: 100000, type: 'increase' },
            { category: 'Discounts', value: -50000, type: 'decrease' },
            { category: 'Taxes', value: 100000, type: 'increase' },
            { category: 'Total', value: 850000, type: 'total' }
          ]
        },
        health: {
          score: 85,
          metrics: [
            { metric: 'Revenue Growth', value: 92, target: 85 },
            { metric: 'Client Retention', value: 88, target: 90 },
            { metric: 'Service Quality', value: 85, target: 85 },
            { metric: 'Operational Efficiency', value: 78, target: 80 },
            { metric: 'Team Productivity', value: 82, target: 85 },
            { metric: 'Compliance', value: 95, target: 95 }
          ]
        },
        satisfaction: {
          value: 4.2,
          target: 4.5,
          min: 0,
          max: 5
        },
        compliance: {
          value: 95,
          target: 98,
          min: 0,
          max: 100
        },
        targets: {
          items: [
            { 
              label: 'GST Returns',
              actual: 450,
              target: 500,
              ranges: { poor: 200, satisfactory: 350, good: 450, excellent: 500 }
            },
            { 
              label: 'Company Registrations',
              actual: 320,
              target: 400,
              ranges: { poor: 150, satisfactory: 250, good: 350, excellent: 400 }
            },
            { 
              label: 'IPR Filings',
              actual: 280,
              target: 350,
              ranges: { poor: 100, satisfactory: 200, good: 300, excellent: 350 }
            }
          ]
        }
      });
    } catch (error) {
      console.error('Failed to load executive data:', error);
    }
  };

  return (
    <div className="executive-page">
      <div className="page-grid">
        {data.revenue && <RevenueWidget data={data.revenue} title="Total Revenue" />}
        {data.avgDays && <GaugeWidget data={data.avgDays} title="Avg Settlement Days" inverse={true} />}
        {data.activeCases && <DonutWidget data={data.activeCases} title="Active Cases" />}
        {data.pipeline && <FunnelWidget data={data.pipeline} title="Revenue Pipeline" />}
        {data.settlement && <WaterfallWidget data={data.settlement} title="Settlement Breakdown" />}
        {data.health && <RadarWidget data={data.health} title="Business Health" />}
        {data.satisfaction && <GaugeWidget data={data.satisfaction} title="Client Satisfaction" />}
        {data.compliance && <GaugeWidget data={data.compliance} title="Compliance Rate" />}
        {data.targets && <BulletWidget data={data.targets} title="Service Targets" />}
      </div>
    </div>
  );
};