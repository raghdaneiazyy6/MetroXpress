import { Button } from "../../components/ui/Button";

// src/pages/dashboard/Analytics.tsx
export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Analytics & Reports
        </h2>
        <Button>Generate Report</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Analytics</h3>
          {/* Add analytics charts and data here */}
          <p className="text-gray-500">Analytics dashboard coming soon...</p>
        </div>
      </div>
    </div>
  );
};
