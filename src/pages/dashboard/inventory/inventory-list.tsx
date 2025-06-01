import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Filter, ArrowLeftRight, Upload, Download } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { InventoryTable } from "../../../components/inventory/inventory-table";
import { BulkUpload } from "../../../components/inventory/bulk-upload";
import { useInventory, InventoryItem } from "../../../contexts/inventory-context";
import { useTranslation } from "react-i18next";
import { utils, writeFile } from "xlsx";

export function InventoryListPage() {
  const { items, deleteItem, addItem } = useInventory();
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<InventoryItem | null>(null);
  const { t } = useTranslation();

  const handleDelete = (item: InventoryItem) => {
    setDeleteConfirmItem(item);
  };

  const confirmDelete = async () => {
    if (deleteConfirmItem) {
      await deleteItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmItem(null);
  };

  const handleBulkUpload = async (data: any[]) => {
    // Process and validate the data
    const processedData = data.map(row => ({
      name: row.Name,
      description: row.Description,
      category: row.Category,
      quantity: Number(row.Quantity),
      price: Number(row.Price),
      sku: row.SKU,
      barcode: row.Barcode,
      reorderPoint: Number(row.ReorderPoint),
      unit: row.Unit,
      supplier: row.Supplier,
      location: row.Location,
      tags: row.Tags?.split(',').map((tag: string) => tag.trim()) || [],
    }));

    // Add each item
    for (const item of processedData) {
      await addItem(item);
    }

    setShowBulkUpload(false);
  };

  const handleExportData = () => {
    const exportData = items.map(item => ({
      Name: item.name,
      Description: item.description,
      Category: item.category,
      Quantity: item.quantity,
      Price: item.price,
      SKU: item.sku,
      Barcode: item.barcode || '',
      ReorderPoint: item.reorderPoint,
      Unit: item.unit,
      Supplier: item.supplier || '',
      Location: item.location || '',
      Tags: (item.tags || []).join(', '),
      Status: item.status,
      LastUpdated: item.lastUpdated,
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Inventory");
    writeFile(wb, "inventory.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("inventory.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("inventory.description")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-1 h-4 w-4" />
            {t("common.filter")}
          </Button>
          <Link to="/dashboard/inventory/transfer">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeftRight className="mr-1 h-4 w-4" />
              {t("inventory.transfer")}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setShowBulkUpload(true)}
          >
            <Upload className="mr-1 h-4 w-4" />
            {t("inventory.bulkUpload.title")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={handleExportData}
          >
            <Download className="mr-1 h-4 w-4" />
            {t("inventory.export")}
          </Button>
          <Link to="/dashboard/inventory/add">
            <Button size="sm" className="flex items-center">
              <PlusCircle className="mr-1 h-4 w-4" />
              {t("inventory.addItem")}
            </Button>
          </Link>
        </div>
      </div>

      {showBulkUpload ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("inventory.bulkUpload.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BulkUpload
              onUpload={handleBulkUpload}
              template="/templates/inventory-template.xlsx"
            />
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowBulkUpload(false)}
            >
              {t("common.cancel")}
            </Button>
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
              {t("inventory.deleteConfirmTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("inventory.deleteConfirmMessage", { name: deleteConfirmItem.name })}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={cancelDelete}>
                {t("common.cancel")}
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                {t("common.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}