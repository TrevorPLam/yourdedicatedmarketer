# Recharts

Recharts is a composable charting library built on React components. It provides a declarative approach to building charts with React's component model, making it easy to create sophisticated visualizations with minimal configuration.

---

## Overview

Recharts is a **Redefined** chart library built with React and D3. It follows React's component pattern, allowing developers to compose charts using JSX components. The library is designed to be lightweight, extensible, and easy to use.

### Key Features

- **Composable** - Build charts with React components
- **Declarative** - Define charts with JSX
- **Lightweight** - Minimal bundle size impact
- **Powerful** - Built on D3 for maximum flexibility
- **Responsive** - Automatic resizing support
- **Customizable** - Extensive styling and configuration options
- **TypeScript Support** - Full TypeScript definitions

### When to Use Recharts

Recharts is ideal for:

- Dashboard visualizations
- Analytics and reporting interfaces
- Data exploration tools
- Business intelligence applications
- Real-time data monitoring
- Marketing analytics displays

---

## Getting Started

### Installation

```bash
npm install recharts
# or
yarn add recharts
# or
pnpm add recharts
```

### Quick Start

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
];

function SimpleLineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Core Components

### Chart Containers

#### ResponsiveContainer

The `ResponsiveContainer` wraps charts to make them responsive.

```tsx
import { ResponsiveContainer, LineChart } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    {/* chart content */}
  </LineChart>
</ResponsiveContainer>
```

**Props:**

- `width` - Width of the container (number or percentage string)
- `height` - Height of the container (number)
- `minWidth` - Minimum width (number)
- `minHeight` - Minimum height (number)
- `aspect` - Aspect ratio (number)
- `debounce` - Debounce time for resize (number, default: 0)

### Chart Types

#### LineChart

Best for showing trends over time.

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
</LineChart>
```

#### BarChart

Best for comparing discrete categories.

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="pv" fill="#8884d8" />
  <Bar dataKey="uv" fill="#82ca9d" />
</BarChart>
```

#### AreaChart

Best for showing cumulative totals or part-to-whole relationships.

```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="name" />
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
</AreaChart>
```

#### PieChart

Best for showing proportions and percentages.

```tsx
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

<PieChart width={400} height={400}>
  <Pie
    data={data}
    cx={200}
    cy={200}
    labelLine={false}
    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

#### ScatterChart

Best for showing relationships between two variables.

```tsx
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
  <CartesianGrid />
  <XAxis type="number" dataKey="x" name="stature" unit="cm" />
  <YAxis type="number" dataKey="y" name="weight" unit="kg" />
  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
  <Scatter name="A school" data={data} fill="#8884d8" />
</ScatterChart>
```

#### RadarChart

Best for comparing multiple variables across categories.

```tsx
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

<RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={data}>
  <PolarGrid />
  <PolarAngleAxis dataKey="subject" />
  <PolarRadiusAxis />
  <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
  <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
  <Legend />
</RadarChart>
```

### Axes

#### XAxis / YAxis

Configure chart axes with extensive customization options.

```tsx
<XAxis
  dataKey="name"
  axisLine={{ stroke: '#E5E7EB' }}
  tickLine={false}
  tick={{ fill: '#6B7280', fontSize: 12 }}
  dy={10}
/>

<YAxis
  axisLine={false}
  tickLine={false}
  tick={{ fill: '#6B7280', fontSize: 12 }}
  tickFormatter={(value) => `$${value.toLocaleString()}`}
/>
```

**Common Props:**

- `dataKey` - Key for data binding
- `type` - 'number' | 'category'
- `domain` - Domain range (array)
- `tick` - Tick element or props
- `tickFormatter` - Function to format tick labels
- `axisLine` - Axis line props
- `tickLine` - Tick line props
- `label` - Axis label
- `hide` - Hide the axis (boolean)
- `orientation` - 'bottom' | 'top' | 'left' | 'right'

### Cartesian Components

#### CartesianGrid

Adds grid lines to Cartesian charts.

```tsx
<CartesianGrid
  strokeDasharray="3 3"
  stroke="#E5E7EB"
  vertical={true}
  horizontal={true}
/>
```

#### Tooltip

Interactive data point information on hover.

```tsx
<Tooltip
  contentStyle={{
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }}
  labelStyle={{ color: '#111827', fontWeight: 600 }}
  itemStyle={{ color: '#6B7280' }}
  formatter={(value) => [`$${value}`, 'Revenue']}
  separator=": "
/>
```

#### Legend

Chart legend with interactive features.

```tsx
<Legend
  verticalAlign="top"
  height={36}
  iconType="circle"
  wrapperStyle={{ paddingBottom: '20px' }}
/>
```

### Data Series Components

#### Line

Line series for LineChart.

```tsx
<Line
  type="monotone"
  dataKey="sales"
  stroke="#8884d8"
  strokeWidth={2}
  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
  activeDot={{ r: 6 }}
  animationDuration={1500}
/>
```

**Types:**

- `basis` - B-spline curve
- `basisClosed` - Closed B-spline
- `basisOpen` - Open B-spline
- `linear` - Straight lines
- `linearClosed` - Closed straight lines
- `natural` - Natural cubic spline
- `monotoneX` - Monotonic in X
- `monotoneY` - Monotonic in Y
- `monotone` - Alias for monotoneX
- `step` - Step interpolation
- `stepBefore` - Step before
- `stepAfter` - Step after

#### Bar

Bar series for BarChart.

```tsx
<Bar
  dataKey="sales"
  fill="#8884d8"
  radius={[4, 4, 0, 0]}
  barSize={30}
  animationDuration={1500}
/>
```

#### Area

Area series for AreaChart.

```tsx
<Area
  type="monotone"
  dataKey="sales"
  stroke="#8884d8"
  fill="#8884d8"
  fillOpacity={0.3}
/>
```

---

## Advanced Configuration

### Custom Tooltip

```tsx
import { Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

<Tooltip content={<CustomTooltip />} />
```

### Custom Legend

```tsx
const CustomLegend = ({ payload }) => (
  <div className="flex gap-4 justify-center">
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-gray-600">{entry.value}</span>
      </div>
    ))}
  </div>
);

<Legend content={<CustomLegend />} />
```

### Custom Dot/Active Dot

```tsx
const CustomDot = (props) => {
  const { cx, cy, stroke, payload, value } = props;
  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={stroke} viewBox="0 0 1024 1024">
      <path d="M512 1009.984c-274.912 0-497.984-223.072-497.984-497.984s223.072-497.984 497.984-497.984c274.912 0 497.984 223.072 497.984 497.984s-223.072 497.984-497.984 497.984z" />
    </svg>
  );
};

<Line dataKey="value" dot={<CustomDot />} />
```

### Brush for Data Zooming

```tsx
import { Brush } from 'recharts';

<LineChart data={data}>
  {/* ... other components ... */}
  <Brush dataKey="name" height={30} stroke="#8884d8" />
</LineChart>
```

### Reference Lines and Areas

```tsx
import { ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';

<LineChart data={data}>
  <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
  <ReferenceLine y={9800} label="Max" stroke="red" />
  <ReferenceArea x1="Page C" x2="Page E" y1={2000} y2={3000} stroke="red" strokeOpacity={0.3} />
</LineChart>
```

---

## Data Format

### Standard Data Structure

```typescript
interface ChartDataPoint {
  name: string;           // X-axis label or identifier
  value: number;          // Primary value
  [key: string]: any;    // Additional data keys
}

// Example
const data: ChartDataPoint[] = [
  { name: 'Jan', sales: 4000, revenue: 2400, profit: 1600 },
  { name: 'Feb', sales: 3000, revenue: 1398, profit: 1602 },
  { name: 'Mar', sales: 2000, revenue: 9800, profit: -7800 },
];
```

### Multi-Series Data

```typescript
interface MultiSeriesData {
  category: string;
  series1: number;
  series2: number;
  series3: number;
}

const multiSeriesData: MultiSeriesData[] = [
  { category: 'Q1', series1: 4000, series2: 2400, series3: 2400 },
  { category: 'Q2', series1: 3000, series2: 1398, series3: 2210 },
];
```

### Time Series Data

```typescript
interface TimeSeriesData {
  timestamp: number | string;  // Unix timestamp or ISO date string
  value: number;
}

const timeSeriesData: TimeSeriesData[] = [
  { timestamp: '2024-01-01', value: 4000 },
  { timestamp: '2024-01-02', value: 3000 },
  { timestamp: '2024-01-03', value: 5000 },
];
```

---

## Styling and Theming

### Color Palette

```tsx
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  neutral: '#6B7280',
};

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
```

### Tailwind CSS Integration

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function StyledChart({ data }) {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ color: '#111827' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Theme Configuration

```typescript
// themes/chart-theme.ts
export const chartTheme = {
  colors: {
    primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    gray: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280'],
  },
  grid: {
    stroke: '#E5E7EB',
    strokeDasharray: '3 3',
  },
  axis: {
    tick: { fill: '#6B7280', fontSize: 12 },
    axisLine: { stroke: '#E5E7EB' },
  },
  tooltip: {
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};
```

---

## Animation

### Animation Configuration

```tsx
<Line
  dataKey="value"
  stroke="#8884d8"
  animationDuration={1500}
  animationBegin={0}
  animationEasing="ease-out"
  isAnimationActive={true}
/>
```

### Animation Easing Functions

- `ease` - Default easing
- `ease-in` - Slow start
- `ease-out` - Slow end
- `ease-in-out` - Slow start and end
- `linear` - Constant speed

### Conditional Animation

```tsx
const [isAnimated, setIsAnimated] = useState(true);

<Line
  dataKey="value"
  stroke="#8884d8"
  isAnimationActive={isAnimated}
  animationDuration={1500}
/>
```

---

## Accessibility

### ARIA Labels

```tsx
<LineChart
  data={data}
  role="img"
  aria-label="Sales chart showing monthly revenue"
>
  {/* chart components */}
</LineChart>
```

### Keyboard Navigation

```tsx
<LineChart
  data={data}
  tabIndex={0}
  onKeyDown={(e) => {
    // Handle keyboard navigation
    if (e.key === 'ArrowRight') {
      // Move to next data point
    }
  }}
>
  {/* chart components */}
</LineChart>
```

### Screen Reader Support

```tsx
<div role="region" aria-label="Sales Dashboard">
  <h2 id="chart-title">Monthly Sales Performance</h2>
  <ResponsiveContainer>
    <LineChart
      data={data}
      role="img"
      aria-labelledby="chart-title"
      aria-describedby="chart-description"
    >
      {/* chart components */}
    </LineChart>
  </ResponsiveContainer>
  <p id="chart-description" className="sr-only">
    Line chart showing sales performance from January to June.
    Sales peaked in March at $9,800.
  </p>
</div>
```

---

## Performance Optimization

### Large Datasets

```tsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function LargeDatasetChart({ data }) {
  // Sample data for initial render
  const sampledData = useMemo(() => {
    if (data.length > 1000) {
      const step = Math.ceil(data.length / 500);
      return data.filter((_, index) => index % step === 0);
    }
    return data;
  }, [data]);

  return (
    <ResponsiveContainer>
      <LineChart data={sampledData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          dot={false}  // Disable dots for performance
          isAnimationActive={data.length < 500}  // Disable animation for large datasets
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Memoization

```tsx
import { useMemo } from 'react';
import { LineChart, Line } from 'recharts';

function OptimizedChart({ rawData }) {
  const processedData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      value: item.value * 100,  // Transform data
    }));
  }, [rawData]);

  const chartConfig = useMemo(() => ({
    stroke: '#8884d8',
    strokeWidth: 2,
    dot: false,
  }), []);

  return (
    <LineChart data={processedData}>
      <Line dataKey="value" {...chartConfig} />
    </LineChart>
  );
}
```

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <Chart data={data} />
    </Suspense>
  );
}
```

---

## Real-Time Data

### Dynamic Updates

```tsx
import { useState, useEffect } from 'react';

function RealTimeChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          value: Math.random() * 100,
        };
        return [...prevData.slice(1), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          isAnimationActive={false}  // Disable animation for smooth updates
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Common Patterns

### Dashboard Widget

```tsx
function MetricWidget({ title, data, dataKey, color, trend }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#gradient-${dataKey})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Comparison Chart

```tsx
function ComparisonChart({ currentData, previousData }) {
  const combinedData = currentData.map((item, index) => ({
    ...item,
    previous: previousData[index]?.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Current" fill="#3B82F6" />
        <Bar dataKey="previous" name="Previous" fill="#9CA3AF" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### Stacked Chart

```tsx
function StackedBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="desktop" stackId="a" fill="#3B82F6" />
        <Bar dataKey="mobile" stackId="a" fill="#10B981" />
        <Bar dataKey="tablet" stackId="a" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## Best Practices

### Data Preparation

```typescript
// Normalize and validate data before charting
function prepareChartData(rawData: RawDataPoint[]): ChartDataPoint[] {
  return rawData
    .filter(item => item.value != null && !isNaN(item.value))
    .map(item => ({
      name: item.label || 'Unknown',
      value: Number(item.value),
      date: new Date(item.timestamp).toLocaleDateString(),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
```

### Error Handling

```tsx
function SafeChart({ data, children }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  try {
    return children;
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-red-600">Error loading chart</p>
      </div>
    );
  }
}
```

### Responsive Design

```tsx
function ResponsiveChart({ data }) {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const height = containerWidth < 640 ? 200 : 300;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {/* chart components */}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Integration with State Management

### React Query Integration

```tsx
import { useQuery } from '@tanstack/react-query';

function AnalyticsChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalyticsData,
  });

  if (isLoading) return <ChartSkeleton />;
  if (error) return <ChartError message={error.message} />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* chart components */}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Zustand Store Integration

```tsx
import { create } from 'zustand';

interface ChartState {
  data: ChartDataPoint[];
  timeRange: 'day' | 'week' | 'month';
  setTimeRange: (range: 'day' | 'week' | 'month') => void;
  updateData: (data: ChartDataPoint[]) => void;
}

const useChartStore = create<ChartState>((set) => ({
  data: [],
  timeRange: 'week',
  setTimeRange: (range) => set({ timeRange: range }),
  updateData: (data) => set({ data }),
}));

function ConnectedChart() {
  const { data, timeRange, setTimeRange } = useChartStore();

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['day', 'week', 'month'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'active' : ''}
          >
            {range}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* chart components */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

**Chart not rendering:**
- Ensure `ResponsiveContainer` has defined height
- Check data format matches expected structure
- Verify all imports are correct

**Performance issues:**
- Disable animation for large datasets (`isAnimationActive={false}`)
- Remove dots for better performance (`dot={false}`)
- Use data sampling for datasets > 1000 points
- Implement memoization for data processing

**Tooltip not showing:**
- Verify data keys match exactly
- Check custom tooltip component props
- Ensure chart has sufficient margin for tooltip

**Axis labels cut off:**
- Increase chart margins
- Adjust label positioning
- Use angle rotation for long labels

### Debug Mode

```tsx
<LineChart
  data={data}
  onClick={(e) => console.log('Click:', e)}
  onMouseMove={(e) => console.log('MouseMove:', e)}
  onMouseLeave={(e) => console.log('MouseLeave:', e)}
>
  {/* chart components */}
</LineChart>
```

---

## Migration Guide

### From Recharts v1 to v2

**Breaking Changes:**
- D3 v6 upgrade - some scale behaviors changed
- React 16.8+ required (hooks support)
- TypeScript definitions improved
- Some prop names changed for consistency

**Migration Steps:**
1. Update package: `npm install recharts@^2`
2. Review console warnings for deprecated props
3. Update custom components to use new API
4. Test all chart types thoroughly

### From Other Chart Libraries

**Chart.js to Recharts:**
- Move from canvas to SVG-based rendering
- Replace imperative API with declarative JSX
- Leverage React component model
- Use React state management instead of Chart.js options

---

## Resources

- [Official Documentation](https://recharts.org/en-US)
- [GitHub Repository](https://github.com/recharts/recharts)
- [Examples Gallery](https://recharts.org/en-US/examples)
- [API Reference](https://recharts.org/en-US/api)

---

## Version Information

- **Current Version:** 2.15.4
- **License:** MIT
- **React Support:** 16.8+
- **TypeScript:** Full support
- **Bundle Size:** ~80KB gzipped
