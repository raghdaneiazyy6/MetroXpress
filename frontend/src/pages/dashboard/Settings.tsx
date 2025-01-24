import { Button } from "../../components/ui/Button";

// src/pages/dashboard/Settings.tsx
export const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
        <Button>Save Changes</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          {/* Add settings form here */}
          <p className="text-gray-500">Settings interface coming soon...</p>
        </div>
      </div>
    </div>
  );
};
