import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { roleService } from "../../services/role.service";
import type { Role } from "../../pages/dashboard/roles";
import { useGlobal } from "../../contexts/global-context";

const roleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(10, "Role description must be at least 10 characters"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  role?: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RoleForm({ role, onClose, onSuccess }: RoleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, showSuccess } = useGlobal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      if (role) {
        await roleService.updateRole(role.id, data);
        showSuccess("Role updated successfully");
      } else {
        await roleService.createRole(data);
        showSuccess("Role created successfully");
      }
      onSuccess();
    } catch (err) {
      setError("Failed to save role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Role Name"
        placeholder="Enter role name"
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
          placeholder="Describe the role's responsibilities and permissions"
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
          {role ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}