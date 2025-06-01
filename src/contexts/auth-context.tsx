import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthResponse, authService } from "../services/auth.service";
import { APP_CONFIG } from "../constants/config";

export interface User {
  id: string;
  firstName: string;
  email: string;
  role: string;
  orga_code: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    orga_desc: string;
    orga_code: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    password: string;
  }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(APP_CONFIG.auth.tokenKey);
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem(APP_CONFIG.auth.tokenKey);
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthResponse = (response: AuthResponse) => {
    const { token, firstName, email, role, orga_code } = response;
    const userData = { firstName, email, role, orga_code };
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem(APP_CONFIG.auth.tokenKey, token);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      handleAuthResponse(response);
    } catch (error) {
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: {
    orga_desc: string;
    orga_code: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await authService.signup(data);
      // Don't automatically log in after signup
    } catch (error) {
      throw new Error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
    } catch (error) {
      throw new Error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem(APP_CONFIG.auth.tokenKey);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}