import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Service } from "../../pages/dashboard/customers/services";

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      price: service?.price || 0,
      duration: service?.duration || 60,
      category: service?.category || "",
      status: service?.status || "active",
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Here you would make an API call to save the service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSuccess();
    } catch (err) {
      setError("Failed to save service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-error-50 dark:bg-error-900/30 border border-error-300 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Input
        label="Service Name"
        placeholder="Enter service name"
        error={errors.name?.message}
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
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Describe the service"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price ($)"
          type="number"
          min={0}
          step={0.01}
          placeholder="0.00"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />

        <Input
          label="Duration (minutes)"
          type="number"
          min={1}
          placeholder="60"
          error={errors.duration?.message}
          {...register("duration", { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Category"
        placeholder="e.g., Consulting, Maintenance"
        error={errors.category?.message}
        {...register("category")}
      />

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register("status")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.status.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {service ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}