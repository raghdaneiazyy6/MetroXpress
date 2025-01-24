// src/components/ui/Card.tsx
import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx("bg-white rounded-lg shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
};
