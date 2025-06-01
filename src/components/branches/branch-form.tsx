import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
  branch?: BranchFormValues;
  onSubmit: (data: BranchFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BranchForm({ branch, onSubmit, onCancel, isLoading }: BranchFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch || {
      status: "active",
    },
  });

  const handleFormSubmit = async (data: BranchFormValues) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError((err as Error).message || "Failed to save branch");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-error-50 dark:bg-error-900/30 border border-error-300 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Branch Name"
          placeholder="Main Branch"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Branch Code"
          placeholder="MB001"
          error={errors.code?.message}
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
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Enter branch address"
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
          {...register("city")}
        />

        <Input
          label="State"
          placeholder="NY"
          error={errors.state?.message}
          {...register("state")}
        />

        <Input
          label="Country"
          placeholder="United States"
          error={errors.country?.message}
          {...register("country")}
        />

        <Input
          label="ZIP Code"
          placeholder="10001"
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="branch@example.com"
          error={errors.email?.message}
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {branch ? "Update Branch" : "Create Branch"}
        </Button>
      </div>
    </form>
  );
}