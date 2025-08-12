import React, { useEffect, useState } from 'react';
import { RevenueWidget } from '../widgets/RevenueWidget';
import { GaugeWidget } from '../widgets/GaugeWidget';
import { FunnelWidget } from '../widgets/FunnelWidget';
import { WaterfallWidget } from '../widgets/WaterfallWidget';
import { BulletWidget } from '../widgets/BulletWidget';
import { dataService } from '../../services/DataService';
import './RevenuePage.css';

export const RevenuePage: React.FC = () => {
  const [data, setData] = useState<any>({
    totalRevenue: null,
    cacPerCase: null,
    averageCaseValue: null,
    pipelineValue: null,
    settlementValue: null,
    revenueTargets: null,
    ytdRevenue: null
  });

  useEffect(() => {
    loadData();
    
    // Subscribe to updates
    const unsubscribe = dataService.subscribe('update', (updateData: any) => {
      setData((prev: any) => ({
        ...prev,
        [updateData.type]: updateData.payload
      }));
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      console.log('RevenuePage: Loading data with LOW revenue values');
      // Simulated data for revenue widgets
      setData({
        totalRevenue: {
          current: 450000,
          target: 600000,
          trend: [
            { month: 'Jan', value: 350000 },
            { month: 'Feb', value: 380000 },
            { month: 'Mar', value: 420000 },
            { month: 'Apr', value: 450000 },
            { month: 'May', value: 480000 },
            { month: 'Jun', value: 510000 }
          ]
        },
        cacPerCase: {
          value: 1250,
          target: 1000,
          min: 0,
          max: 2000
        },
        averageCaseValue: {
          value: 4500,
          min: 2000,
          max: 8000,
          q1: 3200,
          q3: 5800,
          median: 4500
        },
        pipelineValue: {
          total: 3200000,
          stages: [
            { stage: 'Lead', value: 3200000, cases: 850, percentage: 100 },
            { stage: 'Qualified', value: 2400000, cases: 640, percentage: 75 },
            { stage: 'Proposal', value: 1600000, cases: 425, percentage: 50 },
            { stage: 'Negotiation', value: 800000, cases: 210, percentage: 25 },
            { stage: 'Closed Won', value: 320000, cases: 85, percentage: 10 }
          ]
        },
        settlementValue: {
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
        revenueTargets: {
          items: [
            { 
              label: 'Q1 Target',
              actual: 2150000,
              target: 2500000,
              ranges: { poor: 1500000, satisfactory: 2000000, good: 2300000, excellent: 2500000 }
            },
            { 
              label: 'Q2 Target',
              actual: 2600000,
              target: 3000000,
              ranges: { poor: 2000000, satisfactory: 2500000, good: 2800000, excellent: 3000000 }
            },
            { 
              label: 'Monthly Target',
              actual: 850000,
              target: 1000000,
              ranges: { poor: 500000, satisfactory: 750000, good: 900000, excellent: 1000000 }
            }
          ]
        },
        ytdRevenue: {
          current: 4750000,
          target: 6000000,
          trend: [4200000, 4350000, 4500000, 4620000, 4750000]
        }
      });
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    }
  };

  return (
    <div className="revenue-page">
      <div className="page-grid">
        {data.totalRevenue && <RevenueWidget data={data.totalRevenue} title="Total Revenue" />}
        {data.cacPerCase && <GaugeWidget data={data.cacPerCase} title="CAC per Case" inverse={true} />}
        {data.pipelineValue && <FunnelWidget data={data.pipelineValue} title="Pipeline Value" />}
        {data.settlementValue && <WaterfallWidget data={data.settlementValue} title="Settlement Value" />}
        {data.revenueTargets && <BulletWidget data={data.revenueTargets} title="Revenue Targets" />}
        {data.ytdRevenue && <RevenueWidget data={data.ytdRevenue} title="YTD Revenue" />}
      </div>
    </div>
  );
};