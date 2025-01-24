// src/components/common/Sidebar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Cards", href: "/cards", icon: CreditCardIcon },
  { name: "Users", href: "/users", icon: UserGroupIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/settings", icon: CogIcon },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-primary-800 text-white transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!collapsed && <span className="text-xl font-bold">TransitPro</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-primary-700"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary-700"
            >
              <item.icon className="h-6 w-6" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
