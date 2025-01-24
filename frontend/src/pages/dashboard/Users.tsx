import { Button } from "../../components/ui/Button";

// src/pages/dashboard/Users.tsx
export const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <Button>Add New User</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Users</h3>
          {/* Add user list/table here */}
          <p className="text-gray-500">
            User management interface coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};
