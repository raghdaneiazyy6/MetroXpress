// src/components/common/Header.tsx
import { useState } from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

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
  // const [notifications] = useState(3); // Example notification count
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-1 flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Smart Transport System
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <BellIcon className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center leading-5">
                  {notifications}
                </span>
              )}
            </button> */}

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center leading-5">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                          >
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                notification.type === "success"
                                  ? "bg-green-500"
                                  : notification.type === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <div>
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <UserCircleIcon className="h-8 w-8" />
              <span className="hidden md:block">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
