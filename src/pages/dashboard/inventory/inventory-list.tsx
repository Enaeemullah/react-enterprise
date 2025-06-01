import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Filter, ArrowLeftRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { InventoryTable } from "../../../components/inventory/inventory-table";
import { useInventory, InventoryItem } from "../../../contexts/inventory-context";

export function InventoryListPage() {
  const { getItem, deleteItem } = useInventory();
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<InventoryItem | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track your inventory items
          </p>
        </div>
        <div className="flex space-x-3">
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
          <Link to="/dashboard/inventory/add">
            <Button size="sm" className="flex items-center">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      <InventoryTable
        onViewItem={(item) => window.location.href = `/dashboard/inventory/${item.id}`}
        onEditItem={(item) => window.location.href = `/dashboard/inventory/${item.id}/edit`}
        onDeleteItem={handleDelete}
      />

      {/* Delete confirmation dialog */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Delete Inventory Item
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