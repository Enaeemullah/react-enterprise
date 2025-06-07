import React, { useState } from "react";
import { Edit, Trash2, Globe, Image, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { formatDate } from "../../lib/utils";
import { Brand } from "../../services/brand.service";

interface BrandListProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  isLoading?: boolean;
}

export function BrandList({ brands, onEdit, onDelete, isLoading }: BrandListProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    brand: Brand | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    brand: null,
    isDeleting: false,
  });

  const handleDeleteClick = (brand: Brand) => {
    setDeleteConfirmation({
      isOpen: true,
      brand,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.brand) return;

    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await onDelete(deleteConfirmation.brand);
      setDeleteConfirmation({
        isOpen: false,
        brand: null,
        isDeleting: false,
      });
    } catch (error) {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      brand: null,
      isDeleting: false,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading brands...</span>
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
                  Brand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Website
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
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {brand.logo ? (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                              src={brand.logo}
                              alt={brand.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="hidden flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg items-center justify-center border border-gray-200 dark:border-gray-700"
                            >
                              <Image className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            <Image className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {brand.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {brand.description || (
                          <span className="text-gray-400 italic">No description</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 flex items-center transition-colors"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No website</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          brand.status === "active"
                            ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                            : "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400"
                        }`}
                      >
                        {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(new Date(brand.createdAt))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(brand)}
                          className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                          title="Edit brand"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(brand)}
                          className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                          title="Delete brand"
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
                      <Image className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        No brands found
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click "Add Brand" to create your first brand
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
        title="Delete Brand"
        message={
          deleteConfirmation.brand
            ? `Are you sure you want to delete "${deleteConfirmation.brand.name}"? This action cannot be undone and will remove the brand from all associated products.`
            : ""
        }
        confirmText="Delete Brand"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteConfirmation.isDeleting}
      />
    </>
  );
}