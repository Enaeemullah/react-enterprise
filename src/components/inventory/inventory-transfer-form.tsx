import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scan } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BarcodeScanner } from "../ui/barcode-scanner";
import { useInventory } from "../../contexts/inventory-context";
import { branchService, Branch } from "../../services/branch.service";
import { transferService } from "../../services/transfer.service";
import { useGlobal } from "../../contexts/global-context";
import { useNotifications } from "../../contexts/notification-context";

const transferSchema = z.object({
  sourceBranchId: z.string().min(1, "Source branch is required"),
  destinationBranchId: z.string().min(1, "Destination branch is required"),
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
}).refine((data) => data.sourceBranchId !== data.destinationBranchId, {
  message: "Source and destination branches must be different",
  path: ["destinationBranchId"],
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface InventoryTransferFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function InventoryTransferForm({ onClose, onSuccess }: InventoryTransferFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const { items } = useInventory();
  const { showSuccess, showError } = useGlobal();
  const { notifyCreate } = useNotifications();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
  });

  const selectedItemId = watch("itemId");
  const selectedItem = items.find(item => item.id === selectedItemId);
  const sourceBranchId = watch("sourceBranchId");

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const data = await branchService.getBranches();
        setBranches(data);
        console.log('Fetched branches for transfer:', data);
      } catch (error) {
        showError("Failed to fetch branches");
        console.error("Error fetching branches:", error);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, [showError]);

  const handleBarcodeScanned = (barcode: string) => {
    console.log('Barcode scanned:', barcode);
    
    // Find item by barcode, SKU, or name
    const foundItem = items.find(item => 
      item.sku === barcode || 
      item.barcode === barcode ||
      item.name.toLowerCase().includes(barcode.toLowerCase())
    );

    if (foundItem) {
      setValue("itemId", foundItem.id);
      showSuccess(`Item found: ${foundItem.name}`);
    } else {
      showError(`No item found with barcode: ${barcode}`);
    }
  };

  const onSubmit = async (data: TransferFormValues) => {
    if (!selectedItem) {
      showError("Please select a valid item");
      return;
    }

    if (data.quantity > selectedItem.quantity) {
      showError(`Only ${selectedItem.quantity} units available for transfer`);
      return;
    }

    setIsLoading(true);

    try {
      const transferData = {
        sourceBranchId: data.sourceBranchId,
        destinationBranchId: data.destinationBranchId,
        itemId: data.itemId,
        quantity: data.quantity,
        notes: data.notes || '',
        status: 'completed' as const,
      };

      await transferService.createTransfer(transferData);
      
      showSuccess("Transfer completed successfully");
      notifyCreate("Transfer", `${selectedItem.name} (${data.quantity} units)`, true);
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process transfer";
      showError(errorMessage);
      notifyCreate("Transfer", `${selectedItem.name} (${data.quantity} units)`, false);
      console.error("Transfer error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableDestinationBranches = branches.filter(
    branch => branch.id !== sourceBranchId
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source Branch
            </label>
            <select
              className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register("sourceBranchId")}
            >
              <option value="">
                {loadingBranches ? "Loading branches..." : "Select source branch"}
              </option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code}) - {branch.status}
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
              <option value="">
                {!sourceBranchId 
                  ? "Select source branch first" 
                  : loadingBranches 
                  ? "Loading branches..." 
                  : "Select destination branch"
                }
              </option>
              {availableDestinationBranches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code}) - {branch.status}
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
          <div className="flex space-x-2">
            <select
              className="flex-1 block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register("itemId")}
            >
              <option value="">Select item to transfer</option>
              {items
                .filter(item => item.quantity > 0)
                .map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.sku} ({item.quantity} available)
                  </option>
                ))}
            </select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBarcodeScanner(true)}
              className="flex items-center px-3"
              title="Scan barcode"
            >
              <Scan className="h-4 w-4" />
            </Button>
          </div>
          {errors.itemId?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.itemId.message}
            </p>
          )}
        </div>

        {selectedItem && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Selected Item Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{selectedItem.name}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">SKU:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{selectedItem.sku}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Available:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{selectedItem.quantity} units</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Price:</span>
                <span className="ml-2 text-gray-900 dark:text-white">${selectedItem.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <Input
          type="number"
          label="Quantity to Transfer"
          min={1}
          max={selectedItem?.quantity || 1}
          placeholder="Enter quantity"
          error={errors.quantity?.message}
          {...register("quantity", { valueAsNumber: true })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Transfer Notes
          </label>
          <textarea
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Add any notes about this transfer (optional)"
            {...register("notes")}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            Transfer Now
          </Button>
        </div>
      </form>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
        title="Scan Item Barcode"
      />
    </>
  );
}