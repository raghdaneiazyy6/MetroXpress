// src/components/ui/Switch.tsx
import { Switch as HeadlessSwitch } from "@headlessui/react";

interface SwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const Switch = ({ enabled, onChange }: SwitchProps) => {
  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={onChange}
      className={`${
        enabled
          ? "bg-primary-600 dark:bg-primary-500"
          : "bg-gray-200 dark:bg-gray-700"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary`}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-100 transition-transform`}
      />
    </HeadlessSwitch>
  );
};
