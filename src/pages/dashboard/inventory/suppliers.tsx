import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { SupplierForm } from "../../../components/suppliers/supplier-form";
import { SupplierList } from "../../../components/suppliers/supplier-list";

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: "active" | "inactive";
  paymentTerms: string;
  taxId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export function SupplierListPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your inventory suppliers and vendors
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierForm
              supplier={editingSupplier}
              onClose={handleClose}
              onSuccess={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <SupplierList onEdit={handleEdit} />
      )}
    </div>
  );
}