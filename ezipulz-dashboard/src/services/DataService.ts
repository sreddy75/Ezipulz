import axios, { AxiosInstance } from 'axios';
import { DashboardData, Alert, WSMessage } from '../types/kpi.types';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export class DataService {
  private api: AxiosInstance;
  private socket: any = null;
  private subscribers: Map<string, Function[]> = new Map();

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3000') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor
    this.api.interceptors.request.use(
      config => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  // Dashboard Data
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await this.api.get('/api/dashboard');
      return this.transformDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Individual Metrics
  async getBusinessHealth() {
    const response = await this.api.get('/api/metrics/health');
    return response.data;
  }

  async getRevenue() {
    const response = await this.api.get('/api/metrics/revenue');
    return response.data;
  }

  async getPipeline() {
    const response = await this.api.get('/api/metrics/pipeline');
    return response.data;
  }

  async getCases() {
    const response = await this.api.get('/api/metrics/cases');
    return response.data;
  }

  async getProcessingTimes() {
    const response = await this.api.get('/api/metrics/processing');
    return response.data;
  }

  async getSettlements() {
    const response = await this.api.get('/api/metrics/settlements');
    return response.data;
  }

  async getFinancials() {
    const response = await this.api.get('/api/metrics/financials');
    return response.data;
  }

  async getPerformance() {
    const response = await this.api.get('/api/metrics/performance');
    return response.data;
  }

  async getTeam() {
    const response = await this.api.get('/api/metrics/team');
    return response.data;
  }

  async getForecast() {
    const response = await this.api.get('/api/metrics/forecast');
    return response.data;
  }

  async getAIInsights() {
    const response = await this.api.get('/api/metrics/ai-insights');
    return response.data;
  }

  async getAlerts(): Promise<Alert[]> {
    const response = await this.api.get('/api/metrics/alerts');
    return response.data;
  }

  // WebSocket Connection
  connectWebSocket(url: string = process.env.REACT_APP_WS_URL || 'ws://localhost:3000') {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.notifySubscribers('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.notifySubscribers('connection', { status: 'disconnected' });
    });

    this.socket.on('update', (data: any) => {
      this.handleWebSocketMessage({ type: 'update', payload: data, timestamp: new Date() });
    });

    this.socket.on('alert', (data: Alert) => {
      this.handleWebSocketMessage({ type: 'alert', payload: data, timestamp: new Date() });
    });

    this.socket.on('insight', (data: any) => {
      this.handleWebSocketMessage({ type: 'insight', payload: data, timestamp: new Date() });
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      this.notifySubscribers('error', error);
    });
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscription Management
  subscribe(event: string, callback: Function): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(event: string, data: any) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private handleWebSocketMessage(message: WSMessage) {
    this.notifySubscribers(message.type, message.payload);
    this.notifySubscribers('message', message);
  }

  // Data Transformation
  private transformDashboardData(rawData: any): DashboardData {
    return {
      businessHealth: {
        score: rawData.businessHealth?.score || 0,
        status: rawData.businessHealth?.status || 'Good',
        components: rawData.businessHealth?.components || {
          financial: 0,
          operational: 0,
          customer: 0,
          growth: 0
        },
        trend: rawData.businessHealth?.trend || 'stable'
      },
      monetary: this.transformMonetaryData(rawData),
      timeBased: this.transformTimeBasedData(rawData),
      output: this.transformOutputData(rawData),
      alerts: rawData.alerts || [],
      aiInsights: rawData.aiInsights || {
        summary: '',
        opportunities: [],
        predictions: [],
        anomalies: []
      },
      lastUpdated: new Date(rawData.lastUpdated || Date.now())
    };
  }

  private transformMonetaryData(data: any): any {
    // Transform raw data to match MonetaryKPIs interface
    return {
      totalRevenue: {
        current: data.revenue?.current?.total || 0,
        trend: data.revenue?.history?.map((h: any) => h.value) || [],
        change: data.revenue?.current?.change || 0,
        period: 'monthly'
      },
      nwnfRevenue: data.revenue?.current?.nwnf || 0,
      defenceRevenue: data.revenue?.current?.defence || 0,
      cacPerCase: {
        current: data.financials?.cac?.perCase || 0,
        target: 1000,
        trend: data.financials?.cac?.trend || 'stable'
      },
      averageCaseValue: {
        current: data.financials?.averageCaseValue?.current || 0,
        distribution: [],
        byType: data.financials?.averageCaseValue?.byType || { nwnf: 0, defence: 0 }
      },
      pipelineValue: {
        total: data.pipeline?.total?.value || 0,
        byStage: data.pipeline?.byStage || {
          new: 0,
          soc: 0,
          mediation: 0,
          trial: 0
        }
      },
      settlementValue: {
        total: data.settlements?.total || 0,
        byType: this.transformSettlements(data.settlements?.byType || [])
      },
      revenueForecast: {
        predicted: data.forecast?.revenue?.nextMonth || 0,
        confidence: data.forecast?.revenue?.confidence || 0,
        upperBound: 0,
        lowerBound: 0
      },
      monthlyTarget: {
        target: data.financials?.monthlyTarget?.target || 0,
        achieved: data.financials?.monthlyTarget?.achieved || 0,
        percentage: data.financials?.monthlyTarget?.percentage || 0,
        projectedTotal: data.financials?.monthlyTarget?.projectedTotal || 0
      }
    };
  }

  private transformTimeBasedData(data: any): any {
    return {
      unassignedCaseTime: {
        current: data.processing?.times?.unassigned?.current || 0,
        target: data.processing?.times?.unassigned?.target || 0,
        status: data.processing?.times?.unassigned?.status || 'good'
      },
      processingTimes: {
        socGeneration: data.processing?.times?.socGeneration || { current: 0, target: 0, trend: 'stable', status: 'good' },
        socToMediation: data.processing?.times?.socToMediation || { current: 0, target: 0, trend: 'stable', status: 'good' },
        defenceReply: data.processing?.times?.defenceReply || { current: 0, target: 0, trend: 'stable', status: 'good' },
        mediationToTrial: data.processing?.times?.mediationToTrial || { current: 0, target: 0, trend: 'stable', status: 'good' },
        noticeOfDiscontinuance: data.processing?.times?.noticeOfDiscontinuance || { current: 0, target: 0, trend: 'stable', status: 'good' }
      },
      averageAges: data.processing?.averageAge || {
        overall: 0,
        soc: 0,
        mediation: 0,
        trial: 0
      },
      resolutionTime: {
        average: data.team?.performance?.averageResolutionTime || 0,
        distribution: [],
        percentiles: { p25: 0, p50: 0, p75: 0, p95: 0 }
      }
    };
  }

  private transformOutputData(data: any): any {
    return {
      newCases: {
        weekly: data.cases?.weekly?.newCases || 0,
        monthly: data.cases?.monthly?.newCases || 0,
        trend: []
      },
      settledCases: {
        weekly: data.cases?.weekly?.settled || 0,
        monthly: data.cases?.monthly?.settled || 0,
        trend: []
      },
      droppedCases: {
        weekly: data.cases?.weekly?.dropped || 0,
        monthly: data.cases?.monthly?.dropped || 0,
        trend: []
      },
      activeCases: {
        total: data.cases?.statistics?.totalActive || 0,
        byStage: { soc: 0, mediation: 0, trial: 0 }
      },
      successRate: {
        current: data.cases?.statistics?.successRate || 0,
        target: 85,
        trend: []
      },
      attritionRate: {
        current: data.cases?.statistics?.attritionRate || 0,
        target: 15,
        trend: []
      }
    };
  }

  private transformSettlements(settlements: any[]): any {
    const result = {
      soc: { count: 0, value: 0 },
      mediation: { count: 0, value: 0 },
      trial: { count: 0, value: 0 }
    };

    settlements.forEach(s => {
      if (s.type === 'SOC') {
        result.soc = { count: s.count, value: s.totalValue };
      } else if (s.type === 'Mediation') {
        result.mediation = { count: s.count, value: s.totalValue };
      } else if (s.type === 'Trial') {
        result.trial = { count: s.count, value: s.totalValue };
      }
    });

    return result;
  }

  private handleUnauthorized() {
    // Clear token and redirect to login
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }

  // Export data for reporting
  async exportData(format: 'json' | 'csv' | 'pdf' = 'json') {
    const response = await this.api.get(`/api/export?format=${format}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ezipulz-dashboard-${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

// Singleton instance
export const dataService = new DataService();