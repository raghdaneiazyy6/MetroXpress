// src/components/dashboard/ExportButton.tsx
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
} from "../../utils/exportData";

interface ExportButtonProps {
  data: any[];
  filename: string;
}

export const ExportButton = ({ data, filename }: ExportButtonProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = (format: "csv" | "json" | "excel") => {
    switch (format) {
      case "csv":
        exportToCSV(data, filename);
        break;
      case "json":
        exportToJSON(data, filename);
        break;
      case "excel":
        exportToExcel(data, filename);
        break;
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary"
      >
        <span>Generate Report</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <button
              onClick={() => handleExport("csv")}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              Export Data as CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              Export Data as JSON
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              Export Data as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
