const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock data store
let mockData = {
  businessHealth: {
    score: 92,
    status: "Excellent",
    components: {
      financial: 95,
      operational: 88,
      customer: 94,
      growth: 91
    },
    trend: "improving"
  },
  revenue: {
    current: {
      total: 213700,
      nwnf: 128500,
      defence: 85200,
      change: 12.5,
      trend: "up"
    },
    history: generateRevenueHistory(),
    forecast: {
      nextMonth: 235000,
      nextQuarter: 680000,
      confidence: 87
    },
    comparison: {
      lastMonth: 189600,
      lastQuarter: 578400,
      lastYear: 1856000,
      yearToDate: 213700
    }
  },
  pipeline: {
    total: {
      value: 456000,
      cases: 45
    },
    byStage: {
      new: { value: 125000, cases: 12 },
      soc: { value: 165000, cases: 15 },
      mediation: { value: 108000, cases: 9 },
      trial: { value: 58000, cases: 9 }
    }
  },
  cases: {
    statistics: {
      totalActive: 45,
      totalSettled: 168,
      successRate: 85,
      attritionRate: 15
    },
    weekly: {
      newCases: 12,
      settled: 8,
      dropped: 2
    },
    monthly: {
      newCases: 48,
      settled: 32,
      dropped: 8
    }
  },
  processing: {
    times: {
      unassigned: { current: 3.2, target: 2, status: "warning", trend: "down" },
      socGeneration: { current: 2.1, target: 3, status: "good", trend: "up" },
      socToMediation: { current: 14, target: 15, status: "good", trend: "stable" },
      defenceReply: { current: 5, target: 5, status: "good", trend: "stable" },
      mediationToTrial: { current: 30, target: 25, status: "critical", trend: "up" },
      noticeOfDiscontinuance: { current: 4, target: 5, status: "good", trend: "down" }
    },
    averageAge: {
      overall: 60,
      soc: 18,
      mediation: 23,
      trial: 35
    }
  },
  settlements: {
    byType: [
      { type: "SOC", count: 5, totalValue: 75000, averageValue: 15000 },
      { type: "Mediation", count: 3, totalValue: 36000, averageValue: 12000 },
      { type: "Trial", count: 1, totalValue: 18000, averageValue: 18000 }
    ]
  },
  financials: {
    cac: { perCase: 1250, trend: "down" },
    averageCaseValue: {
      current: 4850,
      byType: { nwnf: 5200, defence: 4100 }
    },
    monthlyTarget: {
      target: 250000,
      achieved: 213700,
      percentage: 85.5,
      projectedTotal: 220000
    }
  },
  team: {
    performance: {
      averageResolutionTime: 18.5
    }
  },
  forecast: {
    revenue: {
      nextMonth: 235000,
      nextQuarter: 680000,
      confidence: 87
    }
  },
  aiInsights: {
    summary: "Business performance is strong with 12.5% revenue growth MoM. Pipeline value of $456K indicates healthy future revenue.",
    opportunities: [
      {
        title: "Revenue Optimization",
        description: "NWNF segment showing 15% growth - consider expanding",
        potentialImpact: 35000,
        confidence: 92
      }
    ],
    predictions: [
      {
        metric: "Monthly Revenue",
        prediction: 235000,
        confidence: 87,
        factors: ["Current pipeline", "Historical trends"]
      }
    ],
    anomalies: []
  },
  alerts: [],
  lastUpdated: new Date()
};

// Helper function to generate revenue history
function generateRevenueHistory() {
  const history = [];
  const baseValue = 180000;
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const value = baseValue + (Math.random() * 20000) + (i * 1000);
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
      nwnf: Math.round(value * 0.6),
      defence: Math.round(value * 0.4)
    });
  }
  
  return history;
}

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.get('/api/dashboard', (req, res) => {
  res.json(mockData);
});

app.get('/api/metrics/health', (req, res) => {
  res.json(mockData.businessHealth);
});

app.get('/api/metrics/revenue', (req, res) => {
  const revenue = mockData.revenue.current;
  res.json({
    total: revenue.total,
    nwnf: revenue.nwnf,
    defence: revenue.defence,
    change: revenue.change,
    trend: revenue.trend,
    history: mockData.revenue.history,
    forecast: mockData.revenue.forecast,
    comparison: mockData.revenue.comparison
  });
});

app.get('/api/metrics/pipeline', (req, res) => {
  res.json({
    value: mockData.pipeline.total.value,
    cases: mockData.pipeline.total.cases,
    byStage: mockData.pipeline.byStage
  });
});

app.get('/api/metrics/cases', (req, res) => {
  res.json({
    success_rate: mockData.cases.statistics.successRate,
    attrition_rate: mockData.cases.statistics.attritionRate,
    weekly: mockData.cases.weekly,
    monthly: mockData.cases.monthly,
    total_settled: mockData.cases.statistics.totalSettled,
    total_active: mockData.cases.statistics.totalActive
  });
});

app.get('/api/metrics/processing', (req, res) => {
  res.json(mockData.processing);
});

app.get('/api/metrics/settlements', (req, res) => {
  res.json(mockData.settlements);
});

app.get('/api/metrics/financials', (req, res) => {
  res.json(mockData.financials);
});

app.get('/api/metrics/performance', (req, res) => {
  res.json({
    metrics: [
      { name: "Revenue", score: 95, weight: 0.3 },
      { name: "Cases", score: 88, weight: 0.2 },
      { name: "Efficiency", score: 82, weight: 0.2 }
    ],
    overallScore: 87.3
  });
});

app.get('/api/metrics/team', (req, res) => {
  res.json(mockData.team);
});

app.get('/api/metrics/forecast', (req, res) => {
  res.json(mockData.forecast);
});

app.get('/api/metrics/ai-insights', (req, res) => {
  res.json(mockData.aiInsights);
});

app.get('/api/metrics/alerts', (req, res) => {
  res.json(mockData.alerts);
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('update', {
    type: 'full',
    payload: mockData
  });
  
  // Simulate real-time updates
  const updateInterval = setInterval(() => {
    // Update revenue with small variation
    mockData.revenue.current.total += Math.round((Math.random() - 0.5) * 1000);
    mockData.revenue.current.change = +(Math.random() * 2 + 10).toFixed(1);
    
    // Update cases
    if (Math.random() > 0.7) {
      mockData.cases.weekly.newCases += Math.round(Math.random() * 2);
    }
    
    // Update pipeline
    mockData.pipeline.total.value += Math.round((Math.random() - 0.5) * 5000);
    
    // Send update
    socket.emit('update', {
      type: 'revenue',
      payload: mockData.revenue.current
    });
    
    // Occasionally send alerts
    if (Math.random() > 0.9) {
      socket.emit('alert', {
        id: Date.now().toString(),
        type: 'info',
        category: 'performance',
        message: 'New case assigned successfully',
        priority: 'low',
        timestamp: new Date()
      });
    }
  }, 5000);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(updateInterval);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready for connections`);
});