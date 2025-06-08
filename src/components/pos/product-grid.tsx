import React from "react";
import { Plus, Package } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { InventoryItem } from "../../contexts/inventory-context";

interface ProductGridProps {
  items: InventoryItem[];
  onAddToCart: (item: InventoryItem) => void;
  getStatusColor: (status: string) => string;
}

export function ProductGrid({ items, onAddToCart, getStatusColor }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="relative group hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
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
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.category}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                SKU: {item.sku}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  ${item.price.toFixed(2)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.quantity} left
                </span>
              </div>
              
              <Button
                onClick={() => onAddToCart(item)}
                disabled={item.status === "out-of-stock"}
                className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                {item.status === "out-of-stock" ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}