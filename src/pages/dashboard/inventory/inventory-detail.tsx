import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useInventory } from "../../../contexts/inventory-context";
import { inventoryService } from "../../../services/inventory.service";
import { useGlobal } from "../../../contexts/global-context";
import { formatDate } from "../../../lib/utils";

export function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, deleteItem } = useInventory();
  const { showSuccess, showError, setIsLoading } = useGlobal();
  const [item, setItem] = useState(getItem(id as string));

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        navigate("/dashboard/inventory");
        return;
      }

      // If item not found in context, try to fetch from API
      if (!item) {
        try {
          setIsLoading(true);
          const fetchedItem = await inventoryService.getItem(id);
          setItem(fetchedItem);
        } catch (error) {
          showError("Failed to fetch item details");
          navigate("/dashboard/inventory");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchItem();
  }, [id, item, navigate, setIsLoading, showError]);

  const handleDelete = async () => {
    if (!item || !id) return;

    if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      try {
        setIsLoading(true);
        await inventoryService.deleteItem(id);
        await deleteItem(id);
        showSuccess("Item deleted successfully");
        navigate("/dashboard/inventory");
      } catch (error) {
        showError("Failed to delete item");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Item not found</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/inventory")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/inventory")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Inventory
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.name}
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link to={`/dashboard/inventory/${item.id}/edit`}>
            <Button size="sm" variant="outline" className="flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><Package class="h-16 w-16 text-gray-400" /></div>';
                  }}
                />
              ) : (
                <Package className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-4">
                  Basic Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {item.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      SKU
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white font-mono">
                      {item.sku}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {item.category}
                    </p>
                  </div>
                  {item.brand && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Brand
                      </p>
                      <p className="mt-1 text-base text-gray-900 dark:text-white">
                        {item.brand}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-4">
                  Stock & Pricing
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Stock Quantity
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {item.quantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Selling Price
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  {item.costPrice && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cost Price
                      </p>
                      <p className="mt-1 text-base text-gray-900 dark:text-white">
                        ${item.costPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Value
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <p className="mt-1">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {formatDate(new Date(item.lastUpdated))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}