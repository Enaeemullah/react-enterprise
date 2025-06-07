import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateId } from '../lib/utils';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: 'create' | 'update' | 'delete' | 'read' | 'export' | 'import';
  entity?: string;
  entityName?: string;
  timestamp: Date;
  read: boolean;
  autoHide?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Convenience methods for common operations
  notifyCreate: (entity: string, entityName: string, success?: boolean) => void;
  notifyUpdate: (entity: string, entityName: string, success?: boolean) => void;
  notifyDelete: (entity: string, entityName: string, success?: boolean) => void;
  notifyExport: (entity: string, success?: boolean) => void;
  notifyImport: (entity: string, count: number, success?: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
      autoHide: notification.autoHide ?? true,
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-hide notification if specified
    if (newNotification.autoHide) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, newNotification.duration);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for common CRUD operations
  const notifyCreate = useCallback((entity: string, entityName: string, success: boolean = true) => {
    addNotification({
      type: success ? 'success' : 'error',
      title: success ? `${entity} Created` : `Failed to Create ${entity}`,
      message: success 
        ? `"${entityName}" has been created successfully`
        : `Failed to create "${entityName}". Please try again.`,
      action: 'create',
      entity: entity.toLowerCase(),
      entityName,
      autoHide: true,
    });
  }, [addNotification]);

  const notifyUpdate = useCallback((entity: string, entityName: string, success: boolean = true) => {
    addNotification({
      type: success ? 'success' : 'error',
      title: success ? `${entity} Updated` : `Failed to Update ${entity}`,
      message: success 
        ? `"${entityName}" has been updated successfully`
        : `Failed to update "${entityName}". Please try again.`,
      action: 'update',
      entity: entity.toLowerCase(),
      entityName,
      autoHide: true,
    });
  }, [addNotification]);

  const notifyDelete = useCallback((entity: string, entityName: string, success: boolean = true) => {
    addNotification({
      type: success ? 'success' : 'error',
      title: success ? `${entity} Deleted` : `Failed to Delete ${entity}`,
      message: success 
        ? `"${entityName}" has been deleted successfully`
        : `Failed to delete "${entityName}". Please try again.`,
      action: 'delete',
      entity: entity.toLowerCase(),
      entityName,
      autoHide: true,
    });
  }, [addNotification]);

  const notifyExport = useCallback((entity: string, success: boolean = true) => {
    addNotification({
      type: success ? 'success' : 'error',
      title: success ? 'Export Successful' : 'Export Failed',
      message: success 
        ? `${entity} data has been exported successfully`
        : `Failed to export ${entity} data. Please try again.`,
      action: 'export',
      entity: entity.toLowerCase(),
      autoHide: true,
    });
  }, [addNotification]);

  const notifyImport = useCallback((entity: string, count: number, success: boolean = true) => {
    addNotification({
      type: success ? 'success' : 'error',
      title: success ? 'Import Successful' : 'Import Failed',
      message: success 
        ? `Successfully imported ${count} ${entity.toLowerCase()} items`
        : `Failed to import ${entity.toLowerCase()} data. Please try again.`,
      action: 'import',
      entity: entity.toLowerCase(),
      autoHide: true,
    });
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        notifyCreate,
        notifyUpdate,
        notifyDelete,
        notifyExport,
        notifyImport,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}