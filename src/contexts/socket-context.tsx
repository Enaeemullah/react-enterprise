import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { useGlobal } from './global-context';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const { showSuccess, showError } = useGlobal();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Initialize socket connection
    const socketInstance = io('http://localhost:8080', {
      auth: {
        token
      }
    });

    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Handle inventory updates
    socketInstance.on('inventory:update', (data) => {
      showSuccess(`Inventory item "${data.name}" has been updated`);
    });

    // Handle low stock alerts
    socketInstance.on('inventory:low-stock', (data) => {
      showError(`Low stock alert: ${data.name} is running low (${data.quantity} remaining)`);
    });

    // Handle new orders
    socketInstance.on('order:new', (data) => {
      showSuccess(`New order received: #${data.orderId}`);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}