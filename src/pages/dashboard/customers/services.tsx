import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ServiceForm } from "../../../components/customers/service-form";
import { ServiceList } from "../../../components/customers/service-list";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: "active" | "inactive";
  category: string;
  createdAt: string;
  updatedAt: string;
}

export function CustomerServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Services
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your service offerings and appointments
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              service={editingService}
              onClose={handleClose}
              onSuccess={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <ServiceList onEdit={handleEdit} />
      )}
    </div>
  );
}