// src/components/dashboard/SystemStatus.tsx
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface SystemStatusProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface StatusItemProps {
  label: string;
  value: string;
  status?: "success" | "warning" | "error" | "neutral";
}

const StatusItem = ({ label, value, status = "neutral" }: StatusItemProps) => {
  const statusColors = {
    success: "text-green-500 dark:text-green-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    error: "text-red-500 dark:text-red-400",
    neutral: "text-gray-500 dark:text-gray-400",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className={statusColors[status]}>{value}</span>
    </div>
  );
};

export const SystemStatus = ({ collapsed, onToggle }: SystemStatusProps) => {
  const systemStatuses = [
    { label: "Server Status", value: "Online", status: "success" },
    { label: "Last Update", value: format(new Date(), "PP pp") },
    { label: "Active Users", value: "234", status: "success" },
    { label: "System Load", value: "45%", status: "warning" },
    { label: "Memory Usage", value: "67%", status: "warning" },
    { label: "Storage Space", value: "82%", status: "error" },
  ];

  return (
    <motion.div
      animate={{ height: collapsed ? "auto" : "auto" }}
      className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
        onClick={onToggle}
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          System Status
        </h2>
        <ChevronDownIcon
          className={`w-5 h-5 transform transition-transform duration-200 text-gray-500 dark:text-gray-400 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-1 divide-y divide-gray-100">
              {systemStatuses.map((status) => (
                <StatusItem
                  key={status.label}
                  label={status.label}
                  value={status.value}
                  status={status.status}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
