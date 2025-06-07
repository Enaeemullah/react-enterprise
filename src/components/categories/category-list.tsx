import React, { useState } from "react";
import { Edit, Trash2, Loader2, FolderOpen } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { formatDate } from "../../lib/utils";
import { Category } from "../../services/category.service";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isLoading?: boolean;
}

export function CategoryList({ categories, onEdit, onDelete, isLoading }: CategoryListProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    category: Category | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    category: null,
    isDeleting: false,
  });

  const handleDeleteClick = (category: Category) => {
    setDeleteConfirmation({
      isOpen: true,
      category,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.category) return;

    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await onDelete(deleteConfirmation.category);
      setDeleteConfirmation({
        isOpen: false,
        category: null,
        isDeleting: false,
      });
    } catch (error) {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      category: null,
      isDeleting: false,
    });
  };

  // Helper function to safely format status
  const formatStatus = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to get status badge class
  const getStatusBadgeClass = (status: string | undefined) => {
    if (!status) {
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
    
    switch (status) {
      case "active":
        return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
      case "inactive":
        return "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.name || "Unnamed Category"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {category.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {category.description || (
                          <span className="text-gray-400 italic">No description</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(category.status)}`}
                      >
                        {formatStatus(category.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {category.createdAt ? formatDate(new Date(category.createdAt)) : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(category)}
                          className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                          title="Edit category"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(category)}
                          className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        No categories found
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click "Add Category" to create your first category
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={
          deleteConfirmation.category
            ? `Are you sure you want to delete "${deleteConfirmation.category.name || 'this category'}"? This action cannot be undone and will affect all products in this category.`
            : ""
        }
        confirmText="Delete Category"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteConfirmation.isDeleting}
      />
    </>
  );
}