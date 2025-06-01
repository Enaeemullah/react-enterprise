import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { InventoryTransferForm } from "../../../components/inventory/inventory-transfer-form";

export function InventoryTransferPage() {
  const handleSuccess = () => {
    // Handle successful transfer
    console.log("Transfer completed successfully");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Transfer Inventory
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryTransferForm
            onClose={() => window.history.back()}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}