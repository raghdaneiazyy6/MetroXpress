// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "rounded-md font-medium transition-colors",
        {
          "bg-primary-600 text-white hover:bg-primary-700":
            variant === "primary",
          "bg-gray-200 text-gray-800 hover:bg-gray-300":
            variant === "secondary",
          "border-2 border-primary-600 text-primary-600 hover:bg-primary-50":
            variant === "outline",
        },
        {
          "px-2.5 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
