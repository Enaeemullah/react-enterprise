import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Filter, ArrowLeftRight, Upload, Download } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { InventoryTable } from "../../../components/inventory/inventory-table";
import { BulkUpload } from "../../../components/inventory/bulk-upload";
import { useInventory, InventoryItem } from "../../../contexts/inventory-context";
import { useTranslation } from "react-i18next";
import { utils, writeFile } from "xlsx";
import { inventoryService } from "../../../services/inventory.service";
import { useGlobal } from "../../../contexts/global-context";
import { useNotifications } from "../../../contexts/notification-context";

interface BulkUploadItem {
  id: string;
  name: string;
  description: string;
  categoryId?: number;
  stockQuantity: number;
  sellingPrice: number;
  costPrice?: number;
  sku: string;
  brand?: string;
  branchId?: number;
  imageUrl?: string;
  isValid: boolean;
  errors: string[];
  isSelected: boolean;
}

export function InventoryListPage() {
  const { items, deleteItem, setItems } = useInventory();
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<InventoryItem | null>(null);
  const { t } = useTranslation();
  const { showSuccess, showError, setIsLoading } = useGlobal();
  const { notifyDelete, notifyExport, notifyImport } = useNotifications();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const data = await inventoryService.getItems();
        setItems(data);
      } catch (error) {
        showError("Failed to fetch inventory items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [setItems, setIsLoading, showError]);

  const handleDelete = (item: InventoryItem) => {
    setDeleteConfirmItem(item);
  };

  const confirmDelete = async () => {
    if (deleteConfirmItem) {
      try {
        setIsLoading(true);
        // First delete from backend
        await inventoryService.deleteItem(deleteConfirmItem.id);
        // Then update local state
        await deleteItem(deleteConfirmItem.id);
        showSuccess("Item deleted successfully");
        notifyDelete("Inventory Item", deleteConfirmItem.name, true);
      } catch (error) {
        showError("Failed to delete item");
        notifyDelete("Inventory Item", deleteConfirmItem.name, false);
      } finally {
        setIsLoading(false);
        setDeleteConfirmItem(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmItem(null);
  };

  const handleBulkUpload = async (selectedItems: BulkUploadItem[]) => {
    try {
      setIsLoading(true);
      
      // Upload items in batches to avoid overwhelming the server
      const batchSize = 50;
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < selectedItems.length; i += batchSize) {
        const batch = selectedItems.slice(i, i + batchSize);
        
        for (const item of batch) {
          try {
            // Transform to backend format
            const backendItem = {
              name: item.name,
              description: item.description,
              categoryId: item.categoryId,
              stockQuantity: item.stockQuantity,
              sellingPrice: item.sellingPrice,
              costPrice: item.costPrice,
              sku: item.sku,
              brand: item.brand,
              branchId: item.branchId,
              imageUrl: item.imageUrl,
            };
            
            await inventoryService.createItem(backendItem);
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push(`${item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      // Refresh the inventory list
      const updatedItems = await inventoryService.getItems();
      setItems(updatedItems);

      // Show results and notify
      if (errorCount === 0) {
        showSuccess(`Successfully uploaded ${successCount} items`);
        notifyImport("Inventory", successCount, true);
      } else if (successCount > 0) {
        showSuccess(`Uploaded ${successCount} items with ${errorCount} errors. Check console for details.`);
        notifyImport("Inventory", successCount, true);
        console.error('Upload errors:', errors);
      } else {
        showError(`Failed to upload items. Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
        notifyImport("Inventory", 0, false);
      }

      setShowBulkUpload(false);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to process bulk upload");
      notifyImport("Inventory", 0, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      if (items.length === 0) {
        showError("No data to export");
        notifyExport("Inventory", false);
        return;
      }

      const exportData = items.map(item => ({
        Name: item.name,
        Description: item.description,
        Category: item.category,
        CategoryId: item.categoryId || '',
        StockQuantity: item.quantity,
        SellingPrice: item.price,
        CostPrice: item.costPrice || '',
        SKU: item.sku,
        Brand: item.brand || '',
        BranchId: item.brandId || '',
        ImageUrl: item.imageUrl || '',
        Status: item.status,
        LastUpdated: item.lastUpdated,
      }));

      const ws = utils.json_to_sheet(exportData);
      
      // Set column widths
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 30 }, // Description
        { wch: 15 }, // Category
        { wch: 12 }, // CategoryId
        { wch: 15 }, // StockQuantity
        { wch: 15 }, // SellingPrice
        { wch: 12 }, // CostPrice
        { wch: 15 }, // SKU
        { wch: 15 }, // Brand
        { wch: 12 }, // BranchId
        { wch: 25 }, // ImageUrl
        { wch: 12 }, // Status
        { wch: 20 }, // LastUpdated
      ];
      ws['!cols'] = colWidths;

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Inventory");
      
      const fileName = `inventory-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      writeFile(wb, fileName);
      
      showSuccess("Inventory data exported successfully");
      notifyExport("Inventory", true);
    } catch (error) {
      showError("Failed to export data");
      notifyExport("Inventory", false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your inventory items and stock levels
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Link to="/dashboard/inventory/transfer">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeftRight className="mr-1 h-4 w-4" />
              Transfer
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setShowBulkUpload(true)}
          >
            <Upload className="mr-1 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={handleExportData}
          >
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
          <Link to="/dashboard/inventory/add">
            <Button size="sm" className="flex items-center">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      {showBulkUpload ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Bulk Upload Inventory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulkUpload onUpload={handleBulkUpload} />
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowBulkUpload(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <InventoryTable
          onViewItem={(item) => window.location.href = `/dashboard/inventory/${item.id}`}
          onEditItem={(item) => window.location.href = `/dashboard/inventory/${item.id}/edit`}
          onDeleteItem={handleDelete}
        />
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Delete Item
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete "{deleteConfirmItem.name}"? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}