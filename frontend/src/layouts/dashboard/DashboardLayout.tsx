// src/layouts/dashboard/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../../components/common/Header";
import { Sidebar } from "../../components/common/Sidebar";

export const DashboardLayout = () => {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-dark-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark-bg-primary">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
