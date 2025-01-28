// src/pages/dashboard/Dashboard.tsx
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import { motion } from "framer-motion";
import {
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { SystemStatus } from "../../components/dashboard/SystemStatus";
import { useState } from "react";

export const Dashboard = () => {
  const { user } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

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
  ];

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <Card className="p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome back!
        </h1>
        <p className="text-sm  dark:text-gray-400">
          Here's what's happening with your transport system today.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-3">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-primary-400">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p
                      className={`ml-2 text-xs font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : stat.changeType === "decrease"
                          ? "text-red-600"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-50  ">
                  <stat.icon className="w-4 h-4 text-primary-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* Quick Actions and System Status */}
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
  );
};
