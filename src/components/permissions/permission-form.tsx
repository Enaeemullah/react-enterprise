import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Permission } from "../../pages/dashboard/permissions";

const permissionSchema = z.object({
  name: z.string().min(2, "Permission name must be at least 2 characters"),
  description: z.string().min(10, "Permission description must be at least 10 characters"),
  module: z.string().min(2, "Module name must be at least 2 characters"),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  permission?: Permission | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PermissionForm({ permission, onClose, onSuccess }: PermissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: permission?.name || "",
      description: permission?.description || "",
      module: permission?.module || "",
    },
  });

  const onSubmit = async (data: PermissionFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Here you would make an API call to save the permission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSuccess();
    } catch (err) {
      setError("Failed to save permission. Please try again.");
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
        label="Permission Name"
        placeholder="Enter permission name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Module"
        placeholder="Enter module name"
        error={errors.module?.message}
        {...register("module")}
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
          placeholder="Describe what this permission allows"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {permission ? "Update Permission" : "Create Permission"}
        </Button>
      </div>
    </form>
  );
}