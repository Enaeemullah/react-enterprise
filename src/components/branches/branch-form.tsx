import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { branchService, CreateBranchDTO, UpdateBranchDTO } from "../../services/branch.service";
import { useGlobal } from "../../contexts/global-context";
import { useNotifications } from "../../contexts/notification-context";

const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  code: z.string().min(2, "Branch code must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Please enter a valid email address"),
  status: z.enum(["active", "inactive"]),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface BranchFormProps {
  branch?: any; // Can be Branch with id or just form values
  onCancel: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit' | 'view';
}

export function BranchForm({ branch, onCancel, onSuccess, isLoading, mode = 'create' }: BranchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useGlobal();
  const { notifyCreate, notifyUpdate } = useNotifications();
  const isEditMode = mode === 'edit' || (branch && branch.id);
  const isViewMode = mode === 'view';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch || {
      status: "active",
    },
  });

  const handleFormSubmit = async (data: BranchFormValues) => {
    if (isViewMode) return; // Don't submit in view mode

    try {
      setIsSubmitting(true);
      
      let result;
      
      if (isEditMode && branch?.id) {
        // Update existing branch
        console.log('Updating branch:', branch.id, data);
        result = await branchService.updateBranch(branch.id, data as UpdateBranchDTO);
        showSuccess("Branch updated successfully");
        notifyUpdate("Branch", data.name, true);
      } else {
        // Create new branch
        console.log('Creating new branch:', data);
        result = await branchService.createBranch(data as CreateBranchDTO);
        showSuccess("Branch created successfully");
        notifyCreate("Branch", data.name, true);
      }
      
      console.log('Operation completed successfully:', result);
      
      // Reset form if creating new branch
      if (!isEditMode) {
        reset();
      }
      
      // Call success callback
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      console.error("Branch form submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save branch";
      showError(errorMessage);
      
      // Notify about the error
      if (isEditMode) {
        notifyUpdate("Branch", data.name, false);
      } else {
        notifyCreate("Branch", data.name, false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Branch Name"
          placeholder="Main Branch"
          error={errors.name?.message}
          disabled={isViewMode}
          {...register("name")}
        />

        <Input
          label="Branch Code"
          placeholder="MB001"
          error={errors.code?.message}
          disabled={isViewMode}
          {...register("code")}
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Address
        </label>
        <textarea
          id="address"
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={3}
          placeholder="Enter branch address"
          disabled={isViewMode}
          {...register("address")}
        />
        {errors.address?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="City"
          placeholder="New York"
          error={errors.city?.message}
          disabled={isViewMode}
          {...register("city")}
        />

        <Input
          label="State"
          placeholder="NY"
          error={errors.state?.message}
          disabled={isViewMode}
          {...register("state")}
        />

        <Input
          label="Country"
          placeholder="United States"
          error={errors.country?.message}
          disabled={isViewMode}
          {...register("country")}
        />

        <Input
          label="ZIP Code"
          placeholder="10001"
          error={errors.zipCode?.message}
          disabled={isViewMode}
          {...register("zipCode")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          error={errors.phone?.message}
          disabled={isViewMode}
          {...register("phone")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="branch@example.com"
          error={errors.email?.message}
          disabled={isViewMode}
          {...register("email")}
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
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isViewMode}
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
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          {isViewMode ? "Close" : "Cancel"}
        </Button>
        {!isViewMode && (
          <Button 
            type="submit" 
            isLoading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            {isEditMode ? "Update Branch" : "Create Branch"}
          </Button>
        )}
      </div>
    </form>
  );
}