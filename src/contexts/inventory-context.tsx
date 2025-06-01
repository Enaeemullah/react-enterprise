import React, { createContext, useContext, useState } from "react";
import { generateId } from "../lib/utils";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  sku: string;
  barcode?: string;
  reorderPoint: number;
  unit: string;
  supplier?: string;
  location?: string;
  tags?: string[];
  lastUpdated: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  isLoading: boolean;
  getItem: (id: string) => InventoryItem | undefined;
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Mock inventory data
const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Laptop - XPS 15",
    description: "Dell XPS 15 with 16GB RAM and 512GB SSD",
    category: "Electronics",
    quantity: 25,
    price: 1299.99,
    status: "in-stock",
    sku: "LAP-XPS15",
    barcode: "123456789",
    reorderPoint: 5,
    unit: "pieces",
    supplier: "Dell Inc.",
    location: "Warehouse A",
    tags: ["laptop", "dell", "electronics"],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "inv-2",
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support",
    category: "Furniture",
    quantity: 12,
    price: 249.99,
    status: "in-stock",
    sku: "FUR-CHAIR1",
    reorderPoint: 3,
    unit: "pieces",
    supplier: "Office Furniture Co.",
    location: "Warehouse B",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "inv-3",
    name: "Wireless Mouse",
    description: "Bluetooth wireless mouse",
    category: "Accessories",
    quantity: 5,
    price: 39.99,
    status: "low-stock",
    sku: "ACC-MOUSE1",
    reorderPoint: 10,
    unit: "pieces",
    supplier: "Logitech",
    location: "Shelf C-12",
    lastUpdated: new Date().toISOString(),
  },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getItem = (id: string) => {
    return items.find((item) => item.id === id);
  };

  const addItem = async (
    item: Omit<InventoryItem, "id" | "lastUpdated">
  ) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newItem: InventoryItem = {
        ...item,
        id: `inv-${generateId()}`,
        lastUpdated: new Date().toISOString(),
      };
      
      setItems((prevItems) => [...prevItems, newItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, updatedFields: Partial<InventoryItem>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updatedFields,
                lastUpdated: new Date().toISOString(),
              }
            : item
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        isLoading,
        getItem,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}