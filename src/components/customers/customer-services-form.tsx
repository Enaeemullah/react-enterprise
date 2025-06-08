import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { customerService, CustomerService, CreateCustomerServiceDTO } from "../../services/customer.service";
import { useGlobal } from "../../contexts/global-context";
import { useNotifications } from "../../contexts/notification-context";

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  category: z.string().min(2, "Category must be at least 2 characters"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface CustomerServicesFormProps {
  customerId: string;
  customerName: string;
}

export function CustomerServicesForm({ customerId, customerName }: CustomerServicesFormProps) {
  const [services, setServices] = useState<CustomerService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<CustomerService | null>(null);
  const { showSuccess, showError } = useGlobal();
  const { notifyCreate, notifyUpdate, notifyDelete } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      duration: 60,
      price: 0,
    },
  });

  // Fetch services for this customer
  useEffect(() => {
    fetchServices();
  }, [customerId]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getCustomerServices(customerId);
      setServices(data);
    } catch (error) {
      showError("Failed to fetch customer services");
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: ServiceFormValues) => {
    try {
      setIsLoading(true);
      
      if (editingService) {
        // Update existing service
        const updatedService = await customerService.updateCustomerService(editingService.id, {
          ...data,
          status: "active",
        });
        setServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s));
        showSuccess("Service updated successfully");
        notifyUpdate("Service", data.name, true);
      } else {
        // Create new service
        const serviceData: CreateCustomerServiceDTO = {
          ...data,
          customerId,
          status: "active",
        };
        const newService = await customerService.createCustomerService(serviceData);
        setServices(prev => [...prev, newService]);
        showSuccess("Service created successfully");
        notifyCreate("Service", data.name, true);
      }
      
      reset();
      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save service";
      showError(errorMessage);
      
      if (editingService) {
        notifyUpdate("Service", data.name, false);
      } else {
        notifyCreate("Service", data.name, false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: CustomerService) => {
    setEditingService(service);
    setValue("name", service.name);
    setValue("description", service.description);
    setValue("price", service.price);
    setValue("duration", service.duration);
    setValue("category", service.category);
    setShowForm(true);
  };

  const handleDelete = async (service: CustomerService) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) {
      return;
    }

    try {
      setIsLoading(true);
      await customerService.deleteCustomerService(service.id);
      setServices(prev => prev.filter(s => s.id !== service.id));
      showSuccess("Service deleted successfully");
      notifyDelete("Service", service.name, true);
    } catch (error) {
      showError("Failed to delete service");
      notifyDelete("Service", service.name, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingService(null);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Services for {customerName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage services associated with this customer
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Service Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <Input
                label="Service Name"
                placeholder="Enter service name"
                error={errors.name?.message}
                disabled={isLoading}
                {...register("name")}
              />

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                  rows={3}
                  placeholder="Describe the service"
                  disabled={isLoading}
                  {...register("description")}
                />
                {errors.description?.message && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Price ($)"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  error={errors.price?.message}
                  disabled={isLoading}
                  {...register("price", { valueAsNumber: true })}
                />

                <Input
                  label="Duration (minutes)"
                  type="number"
                  min={1}
                  placeholder="60"
                  error={errors.duration?.message}
                  disabled={isLoading}
                  {...register("duration", { valueAsNumber: true })}
                />

                <Input
                  label="Category"
                  placeholder="e.g., Consulting"
                  error={errors.category?.message}
                  disabled={isLoading}
                  {...register("category")}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {editingService ? "Update Service" : "Create Service"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No services found for this customer
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Click "Add Service" to create the first service
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>${service.price.toFixed(2)}</span>
                      <span>•</span>
                      <span>{formatDuration(service.duration)}</span>
                      <span>•</span>
                      <span>{service.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      disabled={isLoading}
                      className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service)}
                      disabled={isLoading}
                      className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}