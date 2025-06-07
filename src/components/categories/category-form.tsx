import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { categoryService, CreateCategoryDTO } from "../../services/category.service";
import { useGlobal } from "../../contexts/global-context";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: CategoryFormValues;
  onSubmit?: (data: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, onSuccess, isLoading }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useGlobal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {
      status: "active",
    },
  });

  const handleFormSubmit = async (data: CategoryFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (onSubmit) {
        // Use custom onSubmit if provided
        await onSubmit(data);
      } else {
        // Default behavior: call backend service
        if (category?.id) {
          // Update existing category
          await categoryService.updateCategory(category.id, data);
          showSuccess("Category updated successfully");
        } else {
          // Create new category
          await categoryService.createCategory(data as CreateCategoryDTO);
          showSuccess("Category created successfully");
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save category";
      showError(errorMessage);
      console.error("Category form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Category Name"
        placeholder="Enter category name"
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
          placeholder="Enter category description"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.description.message}
          </p>
        )}
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
          {category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}