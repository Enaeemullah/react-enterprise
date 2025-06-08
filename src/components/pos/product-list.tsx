import React from "react";
import { Plus, Package } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { InventoryItem } from "../../contexts/inventory-context";

interface ProductListProps {
  items: InventoryItem[];
  onAddToCart: (item: InventoryItem) => void;
  getStatusColor: (status: string) => string;
}

export function ProductList({ items, onAddToCart, getStatusColor }: ProductListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${item.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.category} • SKU: {item.sku}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {item.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    ${item.price.toFixed(2)}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.quantity} left
                  </span>
                </div>
                
                <Button
                  onClick={() => onAddToCart(item)}
                  disabled={item.status === "out-of-stock"}
                  className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  {item.status === "out-of-stock" ? "Out of Stock" : "Add"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}