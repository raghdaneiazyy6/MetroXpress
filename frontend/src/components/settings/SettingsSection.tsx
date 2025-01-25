// src/components/settings/SettingsSection.tsx
interface SettingsSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsSection = ({
  icon,
  title,
  description,
  children,
}: SettingsSectionProps) => {
  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-primary-50 dark:bg-dark-bg-tertiary rounded-lg">
          {icon}
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
    </div>
  );
};
