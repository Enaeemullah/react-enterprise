import React from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "../../contexts/auth-context";
import { useTheme } from "../../contexts/theme-context";
import { LanguageSwitcher } from "../ui/language-switcher";
import { NotificationDropdown } from "../ui/notification-dropdown";

interface HeaderProps {
  onMenuButtonClick: () => void;
}

export function Header({ onMenuButtonClick }: HeaderProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onMenuButtonClick}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden sm:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                  type="text"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Notification Dropdown */}
            <NotificationDropdown />
            
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            
            <div className="relative">
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={`${user.name}'s avatar`} 
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <span className="font-medium text-gray-700">{user?.name?.[0]}</span>
                  )}
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </a>
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <a
                      href="/auth/logout"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}