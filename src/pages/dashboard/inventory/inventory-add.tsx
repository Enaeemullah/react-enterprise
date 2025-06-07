import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { InventoryForm } from "../../../components/inventory/inventory-form";
import { useInventory } from "../../../contexts/inventory-context";
import { inventoryService } from "../../../services/inventory.service";
import { useGlobal } from "../../../contexts/global-context";
import type { CreateInventoryItemDTO } from "../../../services/inventory.service";

export function InventoryAddPage() {
  const navigate = useNavigate();
  const { showSuccess, showError, setIsLoading } = useGlobal();
  const { addItem } = useInventory();

  const handleSubmit = async (data: CreateInventoryItemDTO) => {
    try {
      setIsLoading(true);
      // First save to backend
      await inventoryService.createItem(data);
      // Then update local state
      await addItem(data);
      showSuccess("Inventory item created successfully");
      navigate("/dashboard/inventory");
    } catch (error) {
      showError("Failed to create inventory item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Add Inventory Item
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryForm onSubmit={handleSubmit} isLoading={false} />
        </CardContent>
      </Card>
    </div>
  );
}