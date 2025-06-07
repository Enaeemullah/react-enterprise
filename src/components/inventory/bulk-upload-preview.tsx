import React, { useState } from 'react';
import { Check, X, AlertTriangle, Package, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

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

interface BulkUploadPreviewProps {
  items: BulkUploadItem[];
  onSubmit: (selectedItems: BulkUploadItem[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BulkUploadPreview({ items, onSubmit, onCancel, isLoading }: BulkUploadPreviewProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(items.filter(item => item.isValid).map(item => item.id))
  );
  const [showOnlyValid, setShowOnlyValid] = useState(false);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validItems = items.filter(item => item.isValid);
  const invalidItems = items.filter(item => !item.isValid);
  const selectedValidItems = items.filter(item => item.isValid && selectedItems.has(item.id));

  const filteredItems = items.filter(item => {
    if (showOnlyValid && !item.isValid) return false;
    if (showOnlySelected && !selectedItems.has(item.id)) return false;
    return true;
  });

  const handleSelectAll = () => {
    const validItemIds = validItems.map(item => item.id);
    setSelectedItems(new Set(validItemIds));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedValidItems.length === 0) {
      alert('Please select at least one valid item to upload.');
      return;
    }

    try {
      setIsSubmitting(true);
      const itemsToSubmit = items.filter(item => selectedItems.has(item.id));
      await onSubmit(itemsToSubmit);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload items. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle checkbox change for select all
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      handleSelectAll();
    } else {
      handleDeselectAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Items</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Valid Items</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{validItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <X className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Invalid Items</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{invalidItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Selected</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedValidItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={validItems.length === 0 || isSubmitting}
          >
            Select All Valid ({validItems.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            disabled={selectedItems.size === 0 || isSubmitting}
          >
            Deselect All
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={showOnlyValid ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowOnlyValid(!showOnlyValid)}
            className="flex items-center"
            disabled={isSubmitting}
          >
            {showOnlyValid ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showOnlyValid ? "Show All" : "Valid Only"}
          </Button>
          <Button
            variant={showOnlySelected ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowOnlySelected(!showOnlySelected)}
            className="flex items-center"
            disabled={isSubmitting}
          >
            {showOnlySelected ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showOnlySelected ? "Show All" : "Selected Only"}
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={validItems.length > 0 && selectedValidItems.length === validItems.length}
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                    disabled={validItems.length === 0 || isSubmitting}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Brand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Branch
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !item.isValid ? 'bg-red-50 dark:bg-red-900/10' : ''
                  } ${
                    selectedItems.has(item.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleItemToggle(item.id)}
                      disabled={!item.isValid || isSubmitting}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isValid ? (
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="ml-2 text-sm text-green-700 dark:text-green-400">Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span className="ml-2 text-sm text-red-700 dark:text-red-400">Invalid</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.imageUrl && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={item.imageUrl}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className={item.imageUrl ? "ml-4" : ""}>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name || 'Unnamed Product'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {item.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {item.sku || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.stockQuantity || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${(item.sellingPrice || 0).toFixed(2)}
                    </div>
                    {item.costPrice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Cost: ${item.costPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.brand || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.branchId ? `Branch ${item.branchId}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {item.errors && item.errors.length > 0 ? (
                      <div className="space-y-1 max-w-xs">
                        {item.errors.slice(0, 3).map((error, index) => (
                          <div key={index} className="text-xs text-red-600 dark:text-red-400">
                            • {error}
                          </div>
                        ))}
                        {item.errors.length > 3 && (
                          <div className="text-xs text-red-500 dark:text-red-400">
                            +{item.errors.length - 3} more...
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-green-600 dark:text-green-400">No issues</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {showOnlyValid ? "No valid items found" : 
               showOnlySelected ? "No selected items found" : 
               "No items to display"}
            </p>
          </div>
        )}
      </div>

      {/* Summary Information */}
      {invalidItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Items with Issues
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{invalidItems.length} items have validation errors and cannot be uploaded.</p>
                <p className="mt-1">Please fix the issues in your file and re-upload, or proceed with valid items only.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedValidItems.length > 0 ? (
            <span>
              Ready to upload <strong>{selectedValidItems.length}</strong> of <strong>{validItems.length}</strong> valid items
            </span>
          ) : (
            <span>Select items to upload</span>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedValidItems.length === 0 || isSubmitting || isLoading}
            isLoading={isSubmitting || isLoading}
            className="flex items-center"
          >
            <Package className="h-4 w-4 mr-2" />
            Upload {selectedValidItems.length} Items
          </Button>
        </div>
      </div>
    </div>
  );
}