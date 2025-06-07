import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { InventoryForm } from "../../../components/inventory/inventory-form";
import { inventoryService } from "../../../services/inventory.service";
import { useGlobal } from "../../../contexts/global-context";
import type { InventoryItem } from "../../../contexts/inventory-context";

export function InventoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, setIsLoading } = useGlobal();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        navigate("/dashboard/inventory");
        return;
      }

      try {
        setIsLoadingItem(true);
        const fetchedItem = await inventoryService.getItem(id);
        setItem(fetchedItem);
      } catch (error) {
        showError("Failed to fetch item details");
        navigate("/dashboard/inventory");
      } finally {
        setIsLoadingItem(false);
      }
    };

    fetchItem();
  }, [id, navigate, showError]);

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      setIsLoading(true);
      await inventoryService.updateItem(id, data);
      showSuccess("Inventory item updated successfully");
      navigate("/dashboard/inventory");
    } catch (error) {
      showError("Failed to update inventory item");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingItem) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Item not found</p>
          <button
            onClick={() => navigate("/dashboard/inventory")}
            className="mt-4 text-primary-600 hover:text-primary-500"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Inventory Item
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryForm
            item={item}
            onSubmit={handleSubmit}
            isLoading={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}