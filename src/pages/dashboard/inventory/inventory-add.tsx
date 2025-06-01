import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { InventoryForm } from "../../../components/inventory/inventory-form";
import { useInventory } from "../../../contexts/inventory-context";

export function InventoryAddPage() {
  const navigate = useNavigate();
  const { addItem, isLoading } = useInventory();

  const handleSubmit = async (data: any) => {
    await addItem(data);
    navigate("/dashboard/inventory");
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
          <InventoryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}