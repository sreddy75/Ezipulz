// KPI Type Definitions for EziPulz Dashboard

// Monetary KPIs
export interface MonetaryKPIs {
  totalRevenue: {
    current: number;
    trend: number[];
    change: number;
    period: 'daily' | 'weekly' | 'monthly';
  };
  nwnfRevenue: number;
  defenceRevenue: number;
  cacPerCase: {
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
  averageCaseValue: {
    current: number;
    distribution: number[];
    byType: {
      nwnf: number;
      defence: number;
    };
  };
  pipelineValue: {
    total: number;
    byStage: {
      new: number;
      soc: number;
      mediation: number;
      trial: number;
    };
  };
  settlementValue: {
    total: number;
    byType: {
      soc: { count: number; value: number };
      mediation: { count: number; value: number };
      trial: { count: number; value: number };
    };
  };
  revenueForecast: {
    predicted: number;
    confidence: number;
    upperBound: number;
    lowerBound: number;
  };
  monthlyTarget: {
    target: number;
    achieved: number;
    percentage: number;
    projectedTotal: number;
  };
}

// Time-Based KPIs
export interface TimeBasedKPIs {
  unassignedCaseTime: {
    current: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  };
  processingTimes: {
    socGeneration: ProcessingTime;
    socToMediation: ProcessingTime;
    defenceReply: ProcessingTime;
    mediationToTrial: ProcessingTime;
    noticeOfDiscontinuance: ProcessingTime;
  };
  averageAges: {
    overall: number;
    soc: number;
    mediation: number;
    trial: number;
  };
  resolutionTime: {
    average: number;
    distribution: number[];
    percentiles: {
      p25: number;
      p50: number;
      p75: number;
      p95: number;
    };
  };
}

export interface ProcessingTime {
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

// Output KPIs
export interface OutputKPIs {
  newCases: {
    weekly: number;
    monthly: number;
    trend: number[];
  };
  settledCases: {
    weekly: number;
    monthly: number;
    trend: number[];
  };
  droppedCases: {
    weekly: number;
    monthly: number;
    trend: number[];
  };
  activeCases: {
    total: number;
    byStage: {
      soc: number;
      mediation: number;
      trial: number;
    };
  };
  successRate: {
    current: number;
    target: number;
    trend: number[];
  };
  attritionRate: {
    current: number;
    target: number;
    trend: number[];
  };
}

// Business Health Metrics
export interface BusinessHealth {
  score: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  components: {
    financial: number;
    operational: number;
    customer: number;
    growth: number;
  };
  trend: 'improving' | 'stable' | 'declining';
}

// Alert Types
export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'case_delay' | 'trial_delay' | 'cac_increase' | 'performance' | 'capacity';
  message: string;
  impact?: number;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  cases?: string[];
}

// AI Insights
export interface AIInsight {
  summary: string;
  opportunities: Array<{
    title: string;
    description: string;
    potentialImpact: number;
    confidence: number;
  }>;
  predictions: Array<{
    metric: string;
    prediction: number;
    confidence: number;
    factors: string[];
  }>;
  anomalies: Array<{
    metric: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    investigation: string;
  }>;
}

// Combined Dashboard Data
export interface DashboardData {
  businessHealth: BusinessHealth;
  monetary: MonetaryKPIs;
  timeBased: TimeBasedKPIs;
  output: OutputKPIs;
  alerts: Alert[];
  aiInsights: AIInsight;
  lastUpdated: Date;
}

// Chart Configuration Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'scatter' | 'bubble' | 'pie' | 'donut' | 
        'gauge' | 'radar' | 'heatmap' | 'waterfall' | 'funnel' | 'bullet' | 
        'boxplot' | 'histogram' | 'sankey' | 'treemap';
  data: any;
  options?: any;
  updateInterval?: number;
  priority: 'high' | 'medium' | 'low';
}

// WebSocket Message Types
export interface WSMessage {
  type: 'update' | 'alert' | 'insight' | 'connection';
  payload: any;
  timestamp: Date;
}