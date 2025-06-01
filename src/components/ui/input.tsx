import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm",
            "border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-error-300 focus:ring-error-500 focus:border-error-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };