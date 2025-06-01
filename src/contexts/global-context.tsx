import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

interface GlobalContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  organizationCode: string | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
    setError(message);
  };

  const showWarning = (message: string) => {
    toast.warning(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        error,
        setError,
        clearError,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        organizationCode: user?.orga_code || null,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}