// src/components/dashboard/QuickActions.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface QuickActionsProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const QuickActions = ({ collapsed, onToggle }: QuickActionsProps) => {
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
          Quick Actions
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
            <div className="p-4 space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <CreditCardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>Issue New Card</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <DocumentChartBarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>View Reports</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <UsersIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>Manage Users</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <Cog6ToothIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>System Settings</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
