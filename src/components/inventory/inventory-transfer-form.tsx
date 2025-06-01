import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useInventory } from "../../contexts/inventory-context";

const transferSchema = z.object({
  sourceBranchId: z.string().min(1, "Source branch is required"),
  destinationBranchId: z.string().min(1, "Destination branch is required"),
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

// Mock branches data
const MOCK_BRANCHES = [
  { id: "1", name: "Main Branch" },
  { id: "2", name: "Downtown Branch" },
];

interface InventoryTransferFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function InventoryTransferForm({ onClose, onSuccess }: InventoryTransferFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items } = useInventory();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
  });

  const selectedItemId = watch("itemId");
  const selectedItem = items.find(item => item.id === selectedItemId);

  const onSubmit = async (data: TransferFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Here you would make an API call to process the transfer
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (err) {
      setError("Failed to process transfer. Please try again.");
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source Branch
          </label>
          <select
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            {...register("sourceBranchId")}
          >
            <option value="">Select source branch</option>
            {MOCK_BRANCHES.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.sourceBranchId?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.sourceBranchId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destination Branch
          </label>
          <select
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            {...register("destinationBranchId")}
          >
            <option value="">Select destination branch</option>
            {MOCK_BRANCHES.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.destinationBranchId?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.destinationBranchId.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Item
        </label>
        <select
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register("itemId")}
        >
          <option value="">Select item</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.quantity} available)
            </option>
          ))}
        </select>
        {errors.itemId?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.itemId.message}
          </p>
        )}
      </div>

      <Input
        type="number"
        label="Quantity"
        min={1}
        max={selectedItem?.quantity}
        error={errors.quantity?.message}
        {...register("quantity", { valueAsNumber: true })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Add any notes about this transfer"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Process Transfer
        </Button>
      </div>
    </form>
  );
}