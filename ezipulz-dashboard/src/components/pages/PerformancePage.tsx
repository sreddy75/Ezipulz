import React, { useEffect, useState } from 'react';
import { RevenueWidget } from '../widgets/RevenueWidget';
import { DonutWidget } from '../widgets/DonutWidget';
import { GaugeWidget } from '../widgets/GaugeWidget';
import { RadarWidget } from '../widgets/RadarWidget';
import { BulletWidget } from '../widgets/BulletWidget';
import { dataService } from '../../services/DataService';
import './PerformancePage.css';

export const PerformancePage: React.FC = () => {
  const [data, setData] = useState<any>({
    newCases: null,
    settledCases: null,
    droppedCases: null,
    activeCases: null,
    successRate: null,
    attritionRate: null,
    teamPerformance: null,
    qualityScores: null,
    efficiencyIndex: null
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
      console.log('PerformancePage: Loading data with VERY LOW performance values');
      // Simulated data for performance widgets
      setData({
        newCases: {
          current: 45,
          target: 300,
          trend: [
            { month: 'Week 1', value: 35 },
            { month: 'Week 2', value: 28 },
            { month: 'Week 3', value: 39 },
            { month: 'Week 4', value: 45 }
          ]
        },
        settledCases: {
          current: 12,
          target: 250,
          trend: [
            { month: 'Week 1', value: 18 },
            { month: 'Week 2', value: 8 },
            { month: 'Week 3', value: 15 },
            { month: 'Week 4', value: 12 }
          ]
        },
        droppedCases: {
          current: 32,
          target: 20,
          trend: [
            { month: 'Week 1', value: 28 },
            { month: 'Week 2', value: 35 },
            { month: 'Week 3', value: 30 },
            { month: 'Week 4', value: 32 }
          ]
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
        successRate: {
          value: 12,
          target: 90,
          min: 0,
          max: 100
        },
        attritionRate: {
          value: 35,
          target: 5,
          min: 0,
          max: 40
        },
        teamPerformance: {
          score: 82,
          metrics: [
            { metric: 'Productivity', value: 85, target: 90 },
            { metric: 'Quality', value: 88, target: 85 },
            { metric: 'Speed', value: 78, target: 80 },
            { metric: 'Accuracy', value: 92, target: 95 },
            { metric: 'Communication', value: 80, target: 85 },
            { metric: 'Initiative', value: 75, target: 80 }
          ]
        },
        qualityScores: {
          items: [
            { 
              label: 'Documentation',
              actual: 92,
              target: 95,
              ranges: { poor: 70, satisfactory: 80, good: 90, excellent: 95 }
            },
            { 
              label: 'Client Communication',
              actual: 88,
              target: 90,
              ranges: { poor: 65, satisfactory: 75, good: 85, excellent: 90 }
            },
            { 
              label: 'Process Compliance',
              actual: 94,
              target: 98,
              ranges: { poor: 75, satisfactory: 85, good: 92, excellent: 98 }
            }
          ]
        },
        efficiencyIndex: {
          value: 23,
          target: 85,
          min: 0,
          max: 100
        }
      });
    } catch (error) {
      console.error('Failed to load performance data:', error);
    }
  };

  return (
    <div className="performance-page">
      <div className="page-grid">
        {data.newCases && <RevenueWidget data={data.newCases} title="New Cases (Weekly)" />}
        {data.settledCases && <RevenueWidget data={data.settledCases} title="Settled Cases (Weekly)" />}
        {data.activeCases && <DonutWidget data={data.activeCases} title="Active Cases Distribution" />}
        {data.successRate && <GaugeWidget data={data.successRate} title="Success Rate" />}
        {data.attritionRate && <GaugeWidget data={data.attritionRate} title="Attrition Rate" inverse={true} />}
        {data.teamPerformance && <RadarWidget data={data.teamPerformance} title="Team Performance" />}
        {data.qualityScores && <BulletWidget data={data.qualityScores} title="Quality Scores" />}
        {data.efficiencyIndex && <GaugeWidget data={data.efficiencyIndex} title="Efficiency Index" />}
        {data.droppedCases && <RevenueWidget data={data.droppedCases} title="Dropped Cases (Weekly)" />}
      </div>
    </div>
  );
};