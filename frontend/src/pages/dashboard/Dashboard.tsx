// // src/pages/dashboard/Dashboard.tsx
// import { useAuth } from "../../hooks/useAuth";
// import { Card } from "../../components/ui/Card";
// import {
//   UsersIcon,
//   CreditCardIcon,
//   BanknotesIcon,
//   BuildingLibraryIcon,
// } from "@heroicons/react/24/outline";

// export const Dashboard = () => {
//   const { user } = useAuth();

//   const stats = [
//     {
//       title: "Total Users",
//       value: "1,234",
//       icon: UsersIcon,
//       change: "+12%",
//       changeType: "increase",
//     },
//     {
//       title: "Active Cards",
//       value: "892",
//       icon: CreditCardIcon,
//       change: "+7%",
//       changeType: "increase",
//     },
//     {
//       title: "Today's Revenue",
//       value: "$2,456",
//       icon: BanknotesIcon,
//       change: "+18%",
//       changeType: "increase",
//     },
//     {
//       title: "Active Stations",
//       value: "15",
//       icon: BuildingLibraryIcon,
//       change: "0",
//       changeType: "neutral",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Welcome back, {user?.name || "User"}!
//         </h1>
//         <p className="mt-1 text-gray-500">
//           Here's what's happening with your transport system today.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <Card key={stat.title} className="p-6">
//             <div className="flex items-center">
//               <div className="flex-1">
//                 <h3 className="text-sm font-medium text-gray-500">
//                   {stat.title}
//                 </h3>
//                 <div className="mt-1 flex items-baseline">
//                   <p className="text-2xl font-semibold text-gray-900">
//                     {stat.value}
//                   </p>
//                   <p
//                     className={`ml-2 text-sm font-medium ${
//                       stat.changeType === "increase"
//                         ? "text-green-600"
//                         : stat.changeType === "decrease"
//                         ? "text-red-600"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     {stat.change}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
//                 <stat.icon className="w-6 h-6 text-primary-600" />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="p-6">
//           <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
//           <div className="mt-4 space-y-4">
//             {/* Add your recent activity items here */}
//             <p className="text-gray-500">No recent activity to display.</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="p-6">
//           <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
//           <div className="mt-4 space-y-2">
//             <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
//               Issue New Card
//             </button>
//             <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
//               View Reports
//             </button>
//             <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
//               Manage Users
//             </button>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h2 className="text-lg font-medium text-gray-900">System Status</h2>
//           <div className="mt-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-gray-500">System Health</span>
//               <span className="text-sm font-medium text-green-600">
//                 Operational
//               </span>
//             </div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-gray-500">Active Sessions</span>
//               <span className="text-sm font-medium">234</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-500">Server Load</span>
//               <span className="text-sm font-medium">42%</span>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// src/pages/dashboard/Dashboard.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
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
import { format, subDays, subMonths } from "date-fns";
import { ChartType, TimeRange, SortOrder } from "../../types/dashboard";
import { SystemStatus } from "../../components/dashboard/SystemStatus";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { ExportButton } from "../../components/dashboard/ExportButton";

interface DashboardProps {
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
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  data,
}: {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  data: any[];
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4 items-center justify-between">
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
        <select
          className="rounded-md border border-gray-300 px-3 py-1.5 min-w-[120px]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow md:flex-grow-0 max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <ExportButton data={data} filename={`dashboard-data-${timeRange}`} />
      </div>
    </div>
  );
};

export const Dashboard = ({
  initialTimeRange = "week",
  initialChartType = "line",
}: DashboardProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  // const [showNotifications, setShowNotifications] = useState(false);
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [chartData, setChartData] = useState(generateChartData(7));
  const [isLoading, setIsLoading] = useState(true);

  // Update chart data when time range changes
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

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: UsersIcon,
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Active Cards",
      value: "892",
      icon: CreditCardIcon,
      change: "+7%",
      changeType: "increase" as const,
    },
    {
      title: "Today's Revenue",
      value: "$2,456",
      icon: BanknotesIcon,
      change: "+18%",
      changeType: "increase" as const,
    },
    {
      title: "Active Stations",
      value: "15",
      icon: BuildingLibraryIcon,
      change: "0",
      changeType: "neutral" as const,
    },
  ].sort((a, b) => {
    const aValue = parseInt(a.value.replace(/[^0-9]/g, ""));
    const bValue = parseInt(b.value.replace(/[^0-9]/g, ""));
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

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
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="h-full p-4 lg:p-6 flex flex-col gap-4">
        {/* Welcome Section - Made more compact */}
        <Card className="p-4">
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back,{" "}
            <span className="text-primary-800">{user?.name || "User"}</span>!
          </h1>
          <p className="text-sm text-gray-500">
            Here's what's happening with your transport system today.
          </p>
        </Card>

        {/* Controls - Made more compact */}
        <div className="flex-none">
          <Controls
            chartType={chartType}
            setChartType={setChartType}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={chartData}
          />
        </div>

        {/* Stats Grid - Adjusted spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-none">
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-3">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-xs font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <div className="flex items-baseline">
                      <p className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </p>
                      <p
                        className={`ml-2 text-xs font-medium ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : stat.changeType === "decrease"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {stat.change}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-50">
                    <stat.icon className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart Section - Using flex-grow to take remaining space */}
        <ErrorBoundary>
          <Card className="p-3 flex-grow min-h-0">
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </Card>
        </ErrorBoundary>

        {/* Quick Actions and System Status - Made more compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-none">
          <QuickActions
            collapsed={collapsedSections.includes("quickActions")}
            onToggle={() => toggleSection("quickActions")}
          />
          <SystemStatus
            collapsed={collapsedSections.includes("systemStatus")}
            onToggle={() => toggleSection("systemStatus")}
          />
        </div>
      </div>
    </div>
  );
};
