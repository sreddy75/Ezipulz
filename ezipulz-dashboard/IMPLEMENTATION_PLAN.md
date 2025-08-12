# EziPulz Dashboard Implementation Plan

## Project Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Charts**: AG Charts Community & Enterprise
- **State Management**: React Context + Hooks
- **Real-time**: Socket.io Client
- **Routing**: React Router v6
- **Styling**: CSS Modules + CSS Variables
- **Backend**: Node.js + Express + Socket.io

## Component Structure

```
src/
├── components/
│   ├── widgets/
│   │   ├── RevenueWidget.tsx          ✅ Line + Number display
│   │   ├── GaugeWidget.tsx            ✅ Radial gauge
│   │   ├── FunnelWidget.tsx           ⏳ Pipeline funnel
│   │   ├── WaterfallWidget.tsx        ⏳ Settlement breakdown
│   │   ├── BoxPlotWidget.tsx          ⏳ Case value distribution
│   │   ├── HeatmapWidget.tsx          ⏳ Processing times
│   │   ├── RadarWidget.tsx            ⏳ Business health
│   │   ├── BulletWidget.tsx           ⏳ Target vs actual
│   │   ├── HistogramWidget.tsx        ⏳ Resolution times
│   │   ├── DonutWidget.tsx            ⏳ Active cases
│   │   └── AreaWidget.tsx             ⏳ Forecast with bands
│   ├── layout/
│   │   └── Dashboard.tsx              ✅ Main layout
│   └── common/
│       └── ChartWrapper.tsx           ✅ Base wrapper
├── services/
│   └── DataService.ts                 ✅ API & WebSocket
├── types/
│   └── kpi.types.ts                   ✅ TypeScript interfaces
└── pages/
    ├── ExecutivePage.tsx               ⏳ 3 key widgets
    ├── RevenuePage.tsx                 ⏳ 9 monetary KPIs
    ├── OperationsPage.tsx              ⏳ 11 time-based KPIs
    └── PerformancePage.tsx             ⏳ 9 output KPIs
```

## KPI to Widget Mapping (29 Total)

### Page 1: Executive Summary (3 widgets)
1. **Business Health Score** → RadarWidget (spider chart)
2. **Total Revenue** → RevenueWidget (line + number)
3. **Pipeline Value** → FunnelWidget

### Page 2: Revenue Details (9 KPIs)
4. **NWNF Revenue** → Stacked BarChart
5. **Defence Revenue** → Stacked BarChart (combined with NWNF)
6. **CAC per Case** → GaugeWidget
7. **Average Case Value** → BoxPlotWidget
8. **Settlement Value** → WaterfallWidget
9. **Revenue Forecast** → AreaWidget with confidence bands
10. **Monthly Target** → BulletWidget
11. **YTD Revenue** → Number display with sparkline
12. **Revenue Comparison** → Grouped BarChart

### Page 3: Operations (11 KPIs)
13. **Unassigned Time** → HeatmapWidget
14. **SOC Generation Time** → Grouped BarChart
15. **SOC to Mediation Time** → Grouped BarChart
16. **Defence Reply Time** → Grouped BarChart
17. **Mediation to Trial Time** → Grouped BarChart
18. **Notice of Discontinuance Time** → Grouped BarChart
19. **Average Case Age** → RadarWidget
20. **SOC Age** → RadarWidget (combined)
21. **Mediation Age** → RadarWidget (combined)
22. **Trial Age** → RadarWidget (combined)
23. **Resolution Time** → HistogramWidget

### Page 4: Performance (9 KPIs)
24. **New Cases Weekly** → Line chart
25. **New Cases Monthly** → Column chart
26. **Settled Weekly** → Line chart
27. **Settled Monthly** → Column chart
28. **Dropped Weekly** → Line chart (small multiples)
29. **Dropped Monthly** → Stacked column
30. **Active Cases** → DonutWidget
31. **Success Rate** → GaugeWidget
32. **Attrition Rate** → GaugeWidget

## Implementation Priority

### Phase 1: Core Infrastructure ✅
- [x] React app setup
- [x] TypeScript types
- [x] Data service
- [x] Base components

### Phase 2: Essential Widgets (Current)
- [ ] Complete all widget components
- [ ] Implement page layouts
- [ ] Add responsive design

### Phase 3: Backend & Data
- [ ] Create Express server
- [ ] Set up mock data endpoints
- [ ] Implement WebSocket updates

### Phase 4: Polish & Deploy
- [ ] Add animations
- [ ] Performance optimization
- [ ] Docker containerization
- [ ] Production deployment

## Design System

### Colors
```css
--bg-primary: #0A0B0D;
--bg-secondary: #151619;
--accent-blue: #0EA5E9;
--accent-green: #10B981;
--accent-amber: #F59E0B;
--accent-red: #F43F5E;
--text-primary: #FFFFFF;
--text-secondary: #94A3B8;
```

### Widget Sizing
- Executive widgets: Large (span 2 columns)
- Standard widgets: Medium (1 column)
- Gauge widgets: Small (1/2 column)
- Grid: 3x3 per page

### Update Intervals
- Real-time: WebSocket push
- Polling: 30 seconds for non-critical
- Page rotation: 5 seconds

## Next Development Steps

1. **Create remaining widget components** (7 components)
2. **Build page layouts** (4 pages)
3. **Set up backend server** with mock data
4. **Style all components** with production CSS
5. **Add error handling** and loading states
6. **Implement caching** for performance
7. **Add export functionality** (PDF/CSV)
8. **Create admin panel** for configuration

## Testing Strategy

- Unit tests for widgets
- Integration tests for data flow
- E2E tests for page rotation
- Performance testing for large datasets
- Accessibility testing (WCAG 2.1)

## Deployment

```bash
# Development
npm start

# Production build
npm run build

# Docker
docker build -t ezipulz-dashboard .
docker run -p 3000:3000 ezipulz-dashboard
```

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
REACT_APP_UPDATE_INTERVAL=30000
REACT_APP_PAGE_ROTATION=5000
```