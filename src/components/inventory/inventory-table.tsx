import React, { useState } from "react";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InventoryItem, useInventory } from "../../contexts/inventory-context";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/utils";

interface InventoryTableProps {
  onViewItem?: (item: InventoryItem) => void;
  onEditItem?: (item: InventoryItem) => void;
  onDeleteItem?: (item: InventoryItem) => void;
}

export function InventoryTable({
  onViewItem,
  onEditItem,
  onDeleteItem,
}: InventoryTableProps) {
  const { items } = useInventory();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof InventoryItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getStatusBadgeClass = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
      case "low-stock":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400";
      case "out-of-stock":
        return "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleView = (item: InventoryItem) => {
    if (onViewItem) {
      onViewItem(item);
    } else {
      navigate(`/dashboard/inventory/${item.id}`);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    if (onEditItem) {
      onEditItem(item);
    } else {
      navigate(`/dashboard/inventory/${item.id}/edit`);
    }
  };

  const handleDelete = (item: InventoryItem) => {
    if (onDeleteItem) {
      onDeleteItem(item);
    } else {
      // Default delete confirmation
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        // This would typically call a delete service
        console.log("Delete item:", item.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Inventory Items
          </h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 block w-full sm:w-64"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Product
                  {sortField === "name" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortField === "category" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                <div className="flex items-center">
                  Stock
                  {sortField === "quantity" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Price
                  {sortField === "price" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortField === "status" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {item.sku}
                        </div>
                        {item.brand && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {item.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${item.price !== undefined ? item.price.toFixed(2) : 'N/A'}
                    </div>
                    {item.costPrice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Cost: ${item.costPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {item.status
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                        title="Edit item"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                        title="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No items found. {searchTerm && "Try adjusting your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}