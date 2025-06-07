import React, { useState } from "react";
import { Edit, Trash2, Eye, Loader2, Building2 } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { formatDate } from "../../lib/utils";
import { Branch } from "../../services/branch.service";

interface BranchListProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onView?: (branch: Branch) => void;
  isLoading?: boolean;
}

export function BranchList({ branches, onEdit, onDelete, onView, isLoading }: BranchListProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    branch: Branch | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    branch: null,
    isDeleting: false,
  });

  const handleDeleteClick = (branch: Branch) => {
    setDeleteConfirmation({
      isOpen: true,
      branch,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.branch) return;

    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await onDelete(deleteConfirmation.branch);
      setDeleteConfirmation({
        isOpen: false,
        branch: null,
        isDeleting: false,
      });
    } catch (error) {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      branch: null,
      isDeleting: false,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading branches...</span>
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
                  Branch Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
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
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {branch.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Code: {branch.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {branch.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {branch.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {branch.address}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {branch.city}, {branch.state} {branch.zipCode}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {branch.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        branch.status === "active"
                          ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                          : "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400"
                      }`}>
                       {(branch.status || '').charAt(0).toUpperCase() + (branch.status || '').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(new Date(branch.createdAt))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(branch)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            title="View branch details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(branch)}
                          className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                          title="Edit branch"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(branch)}
                          className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                          title="Delete branch"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        No branches found
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click "Add Branch" to create your first branch
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
        title="Delete Branch"
        message={
          deleteConfirmation.branch
            ? `Are you sure you want to delete "${deleteConfirmation.branch.name}"? This action cannot be undone and may affect inventory items and transfers associated with this branch.`
            : ""
        }
        confirmText="Delete Branch"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteConfirmation.isDeleting}
      />
    </>
  );
}