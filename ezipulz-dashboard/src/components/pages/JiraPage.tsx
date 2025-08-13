import React, { useEffect, useState } from 'react';
import { RevenueWidget } from '../widgets/RevenueWidget';
import { DonutWidget } from '../widgets/DonutWidget';
import { GaugeWidget } from '../widgets/GaugeWidget';
import { FunnelWidget } from '../widgets/FunnelWidget';
import { RadarWidget } from '../widgets/RadarWidget';
import { BulletWidget } from '../widgets/BulletWidget';
import { HeatmapWidget } from '../widgets/HeatmapWidget';
import { WaterfallWidget } from '../widgets/WaterfallWidget';
import { dataService } from '../../services/DataService';
import './JiraPage.css';

export const JiraPage: React.FC = () => {
  const [data, setData] = useState<any>({
    sprintVelocity: null,
    issueStatus: null,
    storyPoints: null,
    bugMetrics: null,
    teamPerformance: null,
    sprintProgress: null,
    issueTypes: null,
    burndownChart: null,
    cycleTime: null
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
      console.log('JiraPage: Loading JIRA project metrics');
      // Simulated JIRA data
      setData({
        sprintVelocity: {
          current: 47,
          target: 50,
          trend: [
            { month: 'Sprint 1', value: 42 },
            { month: 'Sprint 2', value: 38 },
            { month: 'Sprint 3', value: 45 },
            { month: 'Sprint 4', value: 47 }
          ]
        },
        issueStatus: {
          total: 156,
          distribution: [
            { category: 'To Do', value: 45, percentage: 29, color: '#64748b' },
            { category: 'In Progress', value: 38, percentage: 24, color: '#f59e0b' },
            { category: 'In Review', value: 25, percentage: 16, color: '#8b5cf6' },
            { category: 'Done', value: 48, percentage: 31, color: '#10b981' }
          ]
        },
        storyPoints: {
          stages: [
            { name: 'Planned', value: 120, cases: 120 },
            { name: 'Committed', value: 95, cases: 95 },
            { name: 'In Progress', value: 72, cases: 72 },
            { name: 'Completed', value: 48, cases: 48 }
          ],
          conversionRate: 40,
          totalCases: 120
        },
        bugMetrics: {
          value: 8,
          target: 5,
          min: 0,
          max: 20,
          thresholds: {
            good: 5,
            warning: 10
          }
        },
        teamPerformance: {
          score: 78,
          metrics: [
            { metric: 'Velocity', value: 94, target: 100 },
            { metric: 'Quality', value: 85, target: 90 },
            { metric: 'Collaboration', value: 72, target: 80 },
            { metric: 'Innovation', value: 68, target: 75 },
            { metric: 'Delivery', value: 82, target: 85 },
            { metric: 'Documentation', value: 71, target: 80 }
          ]
        },
        sprintProgress: {
          items: [
            { 
              label: 'Sprint Goal',
              actual: 72,
              target: 100,
              ranges: { poor: 50, satisfactory: 70, good: 85, excellent: 95 }
            },
            { 
              label: 'Story Completion',
              actual: 68,
              target: 90,
              ranges: { poor: 40, satisfactory: 60, good: 75, excellent: 90 }
            },
            { 
              label: 'Bug Resolution',
              actual: 85,
              target: 95,
              ranges: { poor: 60, satisfactory: 75, good: 85, excellent: 95 }
            }
          ]
        },
        issueTypes: {
          total: 156,
          distribution: [
            { category: 'Story', value: 65, percentage: 42, color: '#0ea5e9' },
            { category: 'Bug', value: 38, percentage: 24, color: '#f43f5e' },
            { category: 'Task', value: 32, percentage: 21, color: '#8b5cf6' },
            { category: 'Epic', value: 21, percentage: 13, color: '#10b981' }
          ]
        },
        burndownChart: {
          data: [
            { category: 'Day 1', value: 120, type: 'increase' },
            { category: 'Day 2', value: -15, type: 'decrease' },
            { category: 'Day 3', value: -22, type: 'decrease' },
            { category: 'Day 4', value: -18, type: 'decrease' },
            { category: 'Day 5', value: -20, type: 'decrease' },
            { category: 'Day 6', value: -12, type: 'decrease' },
            { category: 'Day 7', value: -8, type: 'decrease' },
            { category: 'Day 8', value: -10, type: 'decrease' },
            { category: 'Remaining', value: 15, type: 'total' }
          ]
        },
        cycleTime: {
          data: [
            ['Dev Team', 'Week 1', 3.2],
            ['Dev Team', 'Week 2', 2.8],
            ['Dev Team', 'Week 3', 3.5],
            ['Dev Team', 'Week 4', 2.9],
            ['QA Team', 'Week 1', 1.8],
            ['QA Team', 'Week 2', 2.1],
            ['QA Team', 'Week 3', 1.9],
            ['QA Team', 'Week 4', 2.3],
            ['DevOps', 'Week 1', 0.8],
            ['DevOps', 'Week 2', 0.9],
            ['DevOps', 'Week 3', 0.7],
            ['DevOps', 'Week 4', 1.1]
          ]
        }
      });
    } catch (error) {
      console.error('Failed to load JIRA data:', error);
    }
  };

  return (
    <div className="jira-page">
      <div className="page-grid">
        {data.sprintVelocity && <RevenueWidget data={data.sprintVelocity} title="Sprint Velocity" />}
        {data.issueStatus && <DonutWidget data={data.issueStatus} title="Issue Status Distribution" />}
        {data.storyPoints && <FunnelWidget data={data.storyPoints} title="Story Points Burndown" />}
        {data.bugMetrics && <GaugeWidget data={data.bugMetrics} title="Critical Bugs" inverse={true} />}
        {data.teamPerformance && <RadarWidget data={data.teamPerformance} title="Team Performance Metrics" />}
        {data.sprintProgress && <BulletWidget data={data.sprintProgress} title="Sprint Progress" />}
        {data.issueTypes && <DonutWidget data={data.issueTypes} title="Issue Types" />}
        {data.burndownChart && <WaterfallWidget data={data.burndownChart} title="Sprint Burndown" />}
        {data.cycleTime && <HeatmapWidget data={data.cycleTime} title="Cycle Time Heatmap" />}
      </div>
    </div>
  );
};