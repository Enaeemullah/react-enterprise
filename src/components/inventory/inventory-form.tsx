import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { InventoryItem } from "../../contexts/inventory-context";
import { CreateInventoryItemDTO } from "../../services/inventory.service";

const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  price: z.number().min(0, "Price must be 0 or greater"),
  status: z.enum(["in-stock", "low-stock", "out-of-stock"]),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional(),
  reorderPoint: z.number().min(0, "Reorder point must be 0 or greater"),
  unit: z.string().min(1, "Unit is required"),
  supplier: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: CreateInventoryItemDTO) => Promise<void>;
  isLoading: boolean;
}

export function InventoryForm({ item, onSubmit, isLoading }: InventoryFormProps) {
  const isEditMode = !!item;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      category: item?.category || "",
      quantity: item?.quantity || 0,
      price: item?.price || 0,
      status: item?.status || "in-stock",
      sku: item?.sku || "",
      barcode: item?.barcode || "",
      reorderPoint: item?.reorderPoint || 5,
      unit: item?.unit || "pieces",
      supplier: item?.supplier || "",
      location: item?.location || "",
      tags: item?.tags || [],
    },
  });

  const quantity = watch("quantity");
  const reorderPoint = watch("reorderPoint");

  // Automatically update status based on quantity and reorder point
  const calculateStatus = (qty: number, reorderPt: number): "in-stock" | "low-stock" | "out-of-stock" => {
    if (qty <= 0) return "out-of-stock";
    if (qty <= reorderPt) return "low-stock";
    return "in-stock";
  };

  const handleFormSubmit = async (data: InventoryFormValues) => {
    const status = calculateStatus(data.quantity, data.reorderPoint);
    await onSubmit({ ...data, status });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Product name"
          error={errors.name?.message}
          {...register("name")}
        />
        
        <Input
          label="SKU"
          placeholder="Stock Keeping Unit"
          error={errors.sku?.message}
          {...register("sku")}
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
          placeholder="Product description"
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
          label="Category"
          placeholder="Product category"
          error={errors.category?.message}
          {...register("category")}
        />
        
        <Input
          label="Unit"
          placeholder="e.g., pieces, kg, liters"
          error={errors.unit?.message}
          {...register("unit")}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Input
          label="Quantity"
          type="number"
          min={0}
          placeholder="0"
          error={errors.quantity?.message}
          {...register("quantity", { valueAsNumber: true })}
        />
        
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
          label="Reorder Point"
          type="number"
          min={0}
          placeholder="5"
          error={errors.reorderPoint?.message}
          {...register("reorderPoint", { valueAsNumber: true })}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Barcode"
          placeholder="Optional barcode"
          error={errors.barcode?.message}
          {...register("barcode")}
        />
        
        <Input
          label="Location"
          placeholder="Storage location"
          error={errors.location?.message}
          {...register("location")}
        />
      </div>
      
      <Input
        label="Supplier"
        placeholder="Supplier name"
        error={errors.supplier?.message}
        {...register("supplier")}
      />
      
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Status
        </label>
        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status is automatically calculated based on quantity and reorder point:
          </p>
          <ul className="mt-2 text-sm">
            <li className="text-success-600 dark:text-success-400">
              In Stock: Quantity &gt; Reorder Point
            </li>
            <li className="text-warning-600 dark:text-warning-400">
              Low Stock: Quantity is below Reorder Point
            </li>
            <li className="text-error-600 dark:text-error-400">
              Out of Stock: Quantity = 0
            </li>
          </ul>
          <p className="mt-2 text-sm font-medium">
            Current Status:{" "}
            <span className={`
              ${calculateStatus(quantity, reorderPoint) === "in-stock" && "text-success-600 dark:text-success-400"}
              ${calculateStatus(quantity, reorderPoint) === "low-stock" && "text-warning-600 dark:text-warning-400"}
              ${calculateStatus(quantity, reorderPoint) === "out-of-stock" && "text-error-600 dark:text-error-400"}
            `}>
              {calculateStatus(quantity, reorderPoint).split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
            </span>
          </p>
        </div>
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
          {isEditMode ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}