// src/pages/dashboard/Analytics.tsx
import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { ChartType, TimeRange } from "../../types/dashboard";
import { ExportButton } from "../../components/dashboard/ExportButton";

interface AnalyticsProps {
  initialTimeRange?: TimeRange;
  initialChartType?: ChartType;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Memoized chart data generation
const generateChartData = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(), i), "MMM dd"),
    passengers: Math.floor(Math.random() * 1000) + 500,
    revenue: Math.floor(Math.random() * 5000) + 2000,
    cardIssued: Math.floor(Math.random() * 100) + 10,
    stationTraffic: Math.floor(Math.random() * 2000) + 1000,
  })).reverse();
};

// Controls Component
const Controls = ({
  chartType,
  setChartType,
  timeRange,
  setTimeRange,
}: {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  data: any[];
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-4 flex-wrap gap-y-2">
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 min-w-[120px]"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 min-w-[120px]"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export const Analytics = ({
  initialTimeRange = "week",
  initialChartType = "line",
}: AnalyticsProps) => {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [chartData, setChartData] = useState(generateChartData(7));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const days =
      timeRange === "day"
        ? 1
        : timeRange === "week"
        ? 7
        : timeRange === "month"
        ? 30
        : 365;
    setChartData(generateChartData(days));
    setIsLoading(false);
  }, [timeRange]);

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Loading...</span>
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passengers" fill="#0ea5e9" />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="passengers"
              fill="#0ea5e9"
              stroke="#0ea5e9"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="#10b981"
              stroke="#10b981"
              fillOpacity={0.6}
            />
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="passengers"
              nameKey="date"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="passengers"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h2>
          <p className="text-gray-500">View and analyze system performance</p>
        </div>
        <ExportButton
          data={chartData}
          filename={`analytics-data-${timeRange}`}
        />
      </div>

      <Controls
        chartType={chartType}
        setChartType={setChartType}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        data={chartData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analysis */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
          <div className="h-[400px]">
            <ErrorBoundary>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </ErrorBoundary>
          </div>
        </Card>

        {/* Usage Statistics */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
          <div className="h-[400px]">
            <ErrorBoundary>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cardIssued" fill="#8b5cf6" />
                  <Bar dataKey="stationTraffic" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ErrorBoundary>
          </div>
        </Card>
      </div>
    </div>
  );
};
