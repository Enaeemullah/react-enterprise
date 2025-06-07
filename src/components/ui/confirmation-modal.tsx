import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case "danger":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "primary";
      default:
        return "destructive";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className={`h-6 w-6 ${getIconColor()}`} />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={getConfirmButtonVariant() as any}
                onClick={onConfirm}
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}