import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, Package, Edit, Plus, Download, Upload } from 'lucide-react';
import { Button } from './button';
import { useNotifications } from '../../contexts/notification-context';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActionIcon = (action?: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'update':
        return <Edit className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      case 'import':
        return <Upload className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getActionColor = (action?: string, type?: string) => {
    if (type === 'error') return 'text-red-500';
    
    switch (action) {
      case 'create':
        return 'text-green-500';
      case 'update':
        return 'text-blue-500';
      case 'delete':
        return 'text-red-500';
      case 'export':
        return 'text-purple-500';
      case 'import':
        return 'text-indigo-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:text-red-700"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-l-4',
                      getTypeStyles(notification.type),
                      !notification.read && 'bg-blue-50 dark:bg-blue-900/10'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Action Icon */}
                        <div className={cn(
                          'flex-shrink-0 mt-0.5',
                          getActionColor(notification.action, notification.type)
                        )}>
                          {getActionIcon(notification.action)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                            {notification.entity && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                                {notification.entity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 h-6 w-6"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  You'll see updates about your activities here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {Math.min(10, notifications.length)} of {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}