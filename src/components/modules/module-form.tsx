import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const moduleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  path: z.string().min(1, "Path is required"),
  icon: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  order: z.number().min(0, "Order must be 0 or greater"),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  module?: ModuleFormValues;
  onSubmit: (data: ModuleFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ModuleForm({ module, onSubmit, isLoading }: ModuleFormProps) {
  const isEditMode = !!module;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: module?.name || "",
      description: module?.description || "",
      path: module?.path || "",
      icon: module?.icon || "",
      status: module?.status || "active",
      order: module?.order || 0,
    },
  });

  const handleFormSubmit = async (data: ModuleFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Module name"
          error={errors.name?.message}
          {...register("name")}
        />
        
        <Input
          label="Path"
          placeholder="/path/to/module"
          error={errors.path?.message}
          {...register("path")}
        />
      </div>
      
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Module description"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.description.message}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Icon"
          placeholder="icon-name"
          error={errors.icon?.message}
          {...register("icon")}
        />
        
        <Input
          label="Order"
          type="number"
          min={0}
          placeholder="0"
          error={errors.order?.message}
          {...register("order", { valueAsNumber: true })}
        />
      </div>
      
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
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? "Update Module" : "Add Module"}
        </Button>
      </div>
    </form>
  );
}