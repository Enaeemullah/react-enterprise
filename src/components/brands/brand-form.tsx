import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { brandService, CreateBrandDTO } from "../../services/brand.service";
import { useGlobal } from "../../contexts/global-context";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  brand?: any; // Changed to any to handle brand with id
  onSubmit?: (data: BrandFormValues) => Promise<void>;
  onCancel: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function BrandForm({ brand, onSubmit, onCancel, onSuccess, isLoading }: BrandFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useGlobal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: brand || {
      status: "active",
    },
  });

  const handleFormSubmit = async (data: BrandFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (onSubmit && typeof onSubmit === "function") {
        // Use custom onSubmit if provided and is a function
        await onSubmit(data);
      } else {
        // Default behavior: call backend service
        if (brand?.id) {
          // Update existing brand
          await brandService.updateBrand(brand.id, data);
          showSuccess("Brand updated successfully");
        } else {
          // Create new brand
          await brandService.createBrand(data as CreateBrandDTO);
          showSuccess("Brand created successfully");
        }
      }
      
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save brand";
      showError(errorMessage);
      console.error("Brand form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Brand Name"
        placeholder="Enter brand name"
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
          placeholder="Enter brand description"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <Input
        label="Website"
        type="url"
        placeholder="https://example.com"
        error={errors.website?.message}
        {...register("website")}
      />

      <Input
        label="Logo URL"
        type="url"
        placeholder="https://example.com/logo.png"
        error={errors.logo?.message}
        {...register("logo")}
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
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          {brand?.id ? "Update Brand" : "Create Brand"}
        </Button>
      </div>
    </form>
  );
}