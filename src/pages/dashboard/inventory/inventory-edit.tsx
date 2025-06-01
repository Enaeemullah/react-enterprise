import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { InventoryForm } from "../../../components/inventory/inventory-form";
import { useInventory } from "../../../contexts/inventory-context";

export function InventoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, updateItem, isLoading } = useInventory();
  const [item, setItem] = useState(getItem(id as string));

  useEffect(() => {
    if (!item) {
      navigate("/dashboard/inventory");
    }
  }, [item, navigate]);

  const handleSubmit = async (data: any) => {
    if (id) {
      await updateItem(id, data);
      navigate("/dashboard/inventory");
    }
  };

  if (!item) {
    return null;
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
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}