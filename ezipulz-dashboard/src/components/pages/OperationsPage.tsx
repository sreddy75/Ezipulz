import React, { useEffect, useState } from 'react';
import { HeatmapWidget } from '../widgets/HeatmapWidget';
import { RadarWidget } from '../widgets/RadarWidget';
import { GaugeWidget } from '../widgets/GaugeWidget';
import { dataService } from '../../services/DataService';
import './OperationsPage.css';

export const OperationsPage: React.FC = () => {
  const [data, setData] = useState<any>({
    unassignedTime: null,
    processingTimes: null,
    averageAges: null,
    resolutionTime: null,
    socGeneration: null,
    socToMediation: null,
    defenceReply: null,
    mediationToTrial: null,
    discontinuance: null
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
      console.log('OperationsPage: Loading data with HIGH/CRITICAL gauge values');
      // Simulated data for operations widgets
      setData({
        unassignedTime: {
          data: [
            { day: 'Mon', hour: '9AM', value: 5 },
            { day: 'Mon', hour: '12PM', value: 8 },
            { day: 'Mon', hour: '3PM', value: 12 },
            { day: 'Mon', hour: '6PM', value: 6 },
            { day: 'Tue', hour: '9AM', value: 4 },
            { day: 'Tue', hour: '12PM', value: 9 },
            { day: 'Tue', hour: '3PM', value: 15 },
            { day: 'Tue', hour: '6PM', value: 7 },
            { day: 'Wed', hour: '9AM', value: 6 },
            { day: 'Wed', hour: '12PM', value: 11 },
            { day: 'Wed', hour: '3PM', value: 18 },
            { day: 'Wed', hour: '6PM', value: 8 },
            { day: 'Thu', hour: '9AM', value: 7 },
            { day: 'Thu', hour: '12PM', value: 10 },
            { day: 'Thu', hour: '3PM', value: 14 },
            { day: 'Thu', hour: '6PM', value: 5 },
            { day: 'Fri', hour: '9AM', value: 3 },
            { day: 'Fri', hour: '12PM', value: 7 },
            { day: 'Fri', hour: '3PM', value: 10 },
            { day: 'Fri', hour: '6PM', value: 4 }
          ],
          min: 3,
          max: 18,
          avg: 8.5
        },
        processingTimes: {
          categories: [
            { name: 'GST Returns', current: 24, target: 20 },
            { name: 'Company Registration', current: 48, target: 36 },
            { name: 'IPR Filing', current: 72, target: 60 },
            { name: 'Legal Notices', current: 36, target: 30 }
          ]
        },
        averageAges: {
          score: 75,
          metrics: [
            { metric: 'New Cases', value: 2, target: 1 },
            { metric: 'In Progress', value: 8, target: 7 },
            { metric: 'Under Review', value: 15, target: 14 },
            { metric: 'Pending Docs', value: 22, target: 20 },
            { metric: 'Near Close', value: 35, target: 30 },
            { metric: 'Overdue', value: 45, target: 40 }
          ]
        },
        resolutionTime: {
          value: 85,
          target: 30,
          min: 0,
          max: 120
        },
        socGeneration: {
          value: 72,
          target: 18,
          min: 0,
          max: 96
        },
        socToMediation: {
          value: 98,
          target: 30,
          min: 0,
          max: 120
        },
        defenceReply: {
          value: 45,
          target: 12,
          min: 0,
          max: 60
        },
        mediationToTrial: {
          value: 135,
          target: 40,
          min: 0,
          max: 180
        },
        discontinuance: {
          value: 21,
          target: 7,
          min: 0,
          max: 28
        }
      });
    } catch (error) {
      console.error('Failed to load operations data:', error);
    }
  };

  return (
    <div className="operations-page">
      <div className="page-grid">
        {data.unassignedTime && <HeatmapWidget data={data.unassignedTime} title="Unassigned Case Time" />}
        {data.averageAges && <RadarWidget data={data.averageAges} title="Average Case Ages" />}
        {data.resolutionTime && <GaugeWidget data={data.resolutionTime} title="Resolution Time (Days)" inverse={true} />}
        {data.socGeneration && <GaugeWidget data={data.socGeneration} title="SOC Generation Time (Hours)" inverse={true} />}
        {data.socToMediation && <GaugeWidget data={data.socToMediation} title="SOC to Mediation (Days)" inverse={true} />}
        {data.defenceReply && <GaugeWidget data={data.defenceReply} title="Defence Reply Time (Days)" inverse={true} />}
        {data.mediationToTrial && <GaugeWidget data={data.mediationToTrial} title="Mediation to Trial (Days)" inverse={true} />}
        {data.discontinuance && <GaugeWidget data={data.discontinuance} title="Discontinuance Time (Days)" inverse={true} />}
      </div>
    </div>
  );
};