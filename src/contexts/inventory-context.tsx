import React, { createContext, useContext, useState } from "react";
import { generateId } from "../lib/utils";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId?: number;
  categoryTitle?: string;
  quantity: number;
  stockQuantity?: number;
  price: number;
  sellingPrice?: number;
  costPrice?: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  sku: string;
  brandId?: number;
  barcode?: string;
  reorderPoint: number;
  unit: string;
  supplier?: string;
  location?: string;
  tags?: string[];
  imageUrl?: string;
  lastUpdated: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  isLoading: boolean;
  getItem: (id: string) => InventoryItem | undefined;
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setItems: (items: InventoryItem[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Transform backend response to frontend format
export const transformBackendItem = (backendItem: any): InventoryItem => {
  const quantity = backendItem.stockQuantity || backendItem.quantity || 0;
  const reorderPoint = backendItem.reorderPoint || 5;
  
  // Calculate status based on quantity
  let status: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
  if (quantity <= 0) {
    status = "out-of-stock";
  } else if (quantity <= reorderPoint) {
    status = "low-stock";
  }

  return {
    id: backendItem.id?.toString() || generateId(),
    name: backendItem.name || "",
    description: backendItem.description || "",
    category: backendItem.categoryTitle || backendItem.category || "Uncategorized",
    categoryId: backendItem.categoryId,
    categoryTitle: backendItem.categoryTitle,
    quantity: quantity,
    stockQuantity: backendItem.stockQuantity,
    price: backendItem.sellingPrice || backendItem.price || 0,
    sellingPrice: backendItem.sellingPrice,
    costPrice: backendItem.costPrice,
    status: status,
    sku: backendItem.sku || "",
    brandId: backendItem.brandId,
    barcode: backendItem.barcode,
    reorderPoint: reorderPoint,
    unit: backendItem.unit || "pieces",
    supplier: backendItem.supplier,
    location: backendItem.location,
    tags: backendItem.tags || [],
    imageUrl: backendItem.imageUrl,
    lastUpdated: backendItem.updatedAt || backendItem.lastUpdated || new Date().toISOString(),
  };
};

// Transform frontend item to backend format
export const transformFrontendItem = (frontendItem: Partial<InventoryItem>) => {
  return {
    name: frontendItem.name,
    description: frontendItem.description,
    categoryId: frontendItem.categoryId,
    stockQuantity: frontendItem.quantity || frontendItem.stockQuantity,
    sellingPrice: frontendItem.price || frontendItem.sellingPrice,
    costPrice: frontendItem.costPrice,
    sku: frontendItem.sku,
    brandId: frontendItem.brandId,
    imageUrl: frontendItem.imageUrl,
    // Add other fields as needed by your backend
  };
};

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setItems = (newItems: InventoryItem[]) => {
    setItemsState(newItems);
  };

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
      
      setItemsState((prevItems) => [...prevItems, newItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, updatedFields: Partial<InventoryItem>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setItemsState((prevItems) =>
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
      
      setItemsState((prevItems) => prevItems.filter((item) => item.id !== id));
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
        setItems,
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