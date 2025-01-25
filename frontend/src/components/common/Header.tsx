// src/components/common/Header.tsx
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

// Sample notifications
const notifications = [
  {
    id: 1,
    message: "New user registration",
    time: "5 minutes ago",
    type: "info",
  },
  {
    id: 2,
    message: "System maintenance scheduled",
    time: "1 hour ago",
    type: "warning",
  },
  {
    id: 3,
    message: "Revenue target achieved",
    time: "2 hours ago",
    type: "success",
  },
];

export const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications || showUserMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setShowNotifications(false);
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showUserMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  const userMenuItems = [
    {
      label: "Profile",
      icon: UserIcon,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Settings",
      icon: Cog6ToothIcon,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Logout",
      icon: ArrowRightOnRectangleIcon,
      onClick: handleLogout,
      className:
        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
  ];

  return (
    <header className="bg-white dark:bg-dark-bg-secondary shadow-sm border-b border-gray-200 dark:border-dark-border">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-1 flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Smart Transport System
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-gray-500 dark:text-primary-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {/* Notifications */}
            <div className="dropdown-container relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-gray-600 dark:text-primary-400 hover:text-gray-900 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
              >
                <BellIcon className="h-6 w-6" />
                {notificationsList.length > 0 && (
                  <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center leading-5">
                    {notificationsList.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        {notificationsList.length > 0 && (
                          <button
                            onClick={() => setNotificationsList([])}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {notificationsList.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            No new notifications
                          </p>
                        ) : (
                          notificationsList.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 1 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              className="group flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors relative"
                            >
                              <div
                                className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                  notification.type === "success"
                                    ? "bg-green-500"
                                    : notification.type === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {notification.time}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setNotificationsList(
                                    notificationsList.filter(
                                      (n) => n.id !== notification.id
                                    )
                                  );
                                }}
                                className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-opacity"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="dropdown-container relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 text-gray-600 dark:text-primary-400 hover:text-gray-900 dark:hover:text-primary-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8" />
                )}
                <span className="hidden md:block dark:text-gray-200">
                  {user?.name || "User"}
                </span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="py-1">
                      {userMenuItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setShowUserMenu(false);
                            item.onClick();
                          }}
                          className={`w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary ${
                            item.className || ""
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
