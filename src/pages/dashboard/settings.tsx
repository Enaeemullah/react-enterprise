import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useTheme } from "../../contexts/theme-context";
import { useProfile } from "../../contexts/profile-context";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { profile, updatePreferences, isLoading } = useProfile();
  const [successMessage, setSuccessMessage] = useState("");
  
  const [preferences, setPreferences] = useState({
    notifications: profile?.preferences?.notifications ?? true,
    emailUpdates: profile?.preferences?.emailUpdates ?? true,
    dashboardView: profile?.preferences?.dashboardView ?? "grid",
  });

  const handleToggleChange = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleViewChange = (view: "grid" | "list") => {
    setPreferences((prev) => ({
      ...prev,
      dashboardView: view,
    }));
  };

  const savePreferences = async () => {
    try {
      await updatePreferences(preferences);
      setSuccessMessage("Settings saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {successMessage && (
        <div className="bg-success-50 dark:bg-success-900/30 border border-success-300 dark:border-success-800 text-success-700 dark:text-success-400 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <Button
                  variant={theme === "light" ? "primary" : "outline"}
                  onClick={() => theme === "dark" && toggleTheme()}
                  className="w-24"
                >
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "primary" : "outline"}
                  onClick={() => theme === "light" && toggleTheme()}
                  className="w-24"
                >
                  Dark
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="ml-2"
                >
                  Toggle
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dashboard View
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <Button
                  variant={preferences.dashboardView === "grid" ? "primary" : "outline"}
                  onClick={() => handleViewChange("grid")}
                  className="w-24"
                >
                  Grid
                </Button>
                <Button
                  variant={preferences.dashboardView === "list" ? "primary" : "outline"}
                  onClick={() => handleViewChange("list")}
                  className="w-24"
                >
                  List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  In-app Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications within the application
                </p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="notifications"
                  className="opacity-0 w-0 h-0"
                  checked={preferences.notifications}
                  onChange={() => handleToggleChange("notifications")}
                />
                <label
                  htmlFor="notifications"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all ${
                    preferences.notifications
                      ? "bg-primary-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] bg-white h-5 w-5 rounded-full transition-all ${
                      preferences.notifications ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Updates
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications about important updates
                </p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="emailUpdates"
                  className="opacity-0 w-0 h-0"
                  checked={preferences.emailUpdates}
                  onChange={() => handleToggleChange("emailUpdates")}
                />
                <label
                  htmlFor="emailUpdates"
                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all ${
                    preferences.emailUpdates
                      ? "bg-primary-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] bg-white h-5 w-5 rounded-full transition-all ${
                      preferences.emailUpdates ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={savePreferences} isLoading={isLoading}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}