import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CustomerForm } from "../../../components/customers/customer-form";
import { CustomerList } from "../../../components/customers/customer-list";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType: "individual" | "business";
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export function CustomersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (data: any) => {
    console.log("Saving customer:", data);
    // Here you would typically make an API call to save the customer
    handleClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your customer database
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm
              customer={editingCustomer ?? undefined}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <CustomerList onEdit={handleEdit} />
      )}
    </div>
  );
}