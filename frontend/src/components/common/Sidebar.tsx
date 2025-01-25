// src/components/common/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext"; // Make sure this import exists

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Cards", href: "/cards", icon: CreditCardIcon },
  { name: "Users", href: "/users", icon: UserGroupIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div
      className={`transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
        ${
          theme === "dark"
            ? "bg-[#1a1f2e] border-r border-[#2d3548]"
            : "bg-primary-800 border-r border-primary-700/50"
        }
        text-white`}
    >
      <div className="flex flex-col h-full">
        <div
          className={`flex items-center justify-between h-16 px-4 border-b ${
            theme === "dark" ? "border-[#2d3548]" : "border-primary-700/50"
          }`}
        >
          {!collapsed && (
            <span className="text-xl font-bold text-white">TransitPro</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg transition-colors text-white
              ${
                theme === "dark" ? "hover:bg-[#2d3548]" : "hover:bg-primary-700"
              }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? theme === "dark"
                        ? "bg-primary-600 text-white"
                        : "bg-primary-700 text-white"
                      : `text-gray-300 ${
                          theme === "dark"
                            ? "hover:bg-[#2d3548]"
                            : "hover:bg-primary-700"
                        } hover:text-white`
                  }`}
              >
                <item.icon
                  className={`h-6 w-6 ${
                    isActive
                      ? "text-white"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
