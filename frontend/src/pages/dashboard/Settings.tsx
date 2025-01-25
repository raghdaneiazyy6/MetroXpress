// src/pages/Settings.tsx
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Switch } from "../../components/ui/Switch";
import { useTheme } from "../../contexts/ThemeContext";
import {
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  DevicePhoneMobileIcon,
  LanguageIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}

const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
}: SettingsSectionProps) => (
  <Card className="p-6">
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-primary-50 dark:bg-dark-bg-tertiary rounded-lg">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
        {children}
      </div>
    </div>
  </Card>
);

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    cardExpiry: true,
    lowBalance: true,
    systemUpdates: true,
    marketing: false,
  });
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [mobileNotifications, setMobileNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved");
  };

  const inputClasses =
    "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 pl-3 pr-10 py-2 text-base text-gray-900 dark:text-white bg-white dark:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 sm:text-sm";

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your application preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Notifications */}
        <SettingsSection
          title="Notifications"
          description="Manage how you receive notifications and alerts"
          icon={BellIcon}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Card Expiry Alerts
              </span>
              <Switch
                enabled={notifications.cardExpiry}
                onChange={(value) =>
                  setNotifications({ ...notifications, cardExpiry: value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Low Balance Alerts
              </span>
              <Switch
                enabled={notifications.lowBalance}
                onChange={(value) =>
                  setNotifications({ ...notifications, lowBalance: value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                System Updates
              </span>
              <Switch
                enabled={notifications.systemUpdates}
                onChange={(value) =>
                  setNotifications({ ...notifications, systemUpdates: value })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Marketing Updates
              </span>
              <Switch
                enabled={notifications.marketing}
                onChange={(value) =>
                  setNotifications({ ...notifications, marketing: value })
                }
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveNotifications}
              className="mt-4"
            >
              Save Notification Settings
            </Button>
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          title="Security"
          description="Manage your account security settings"
          icon={ShieldCheckIcon}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch enabled={twoFactorAuth} onChange={setTwoFactorAuth} />
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Preferences"
          description="Customize your application experience"
          icon={GlobeAltIcon}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <LanguageIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputClasses}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputClasses}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EGP">EGP (E£)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                {theme === "dark" ? (
                  <MoonIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                ) : (
                  <SunIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                )}
                Dark Mode
              </span>
              <Switch enabled={theme === "dark"} onChange={toggleTheme} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePreferences}
              className="mt-2"
            >
              Save Preferences
            </Button>
          </div>
        </SettingsSection>

        {/* Mobile App */}
        <SettingsSection
          title="Mobile App"
          description="Manage your mobile app settings"
          icon={DevicePhoneMobileIcon}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mobile Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive notifications on your mobile device
                </p>
              </div>
              <Switch
                enabled={mobileNotifications}
                onChange={setMobileNotifications}
              />
            </div>
            <Button variant="outline" size="sm">
              Connect Mobile Device
            </Button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};
