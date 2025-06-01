import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useInventory } from "../../../contexts/inventory-context";
import { formatDate } from "../../../lib/utils";

export function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem } = useInventory();
  const item = getItem(id as string);

  useEffect(() => {
    if (!item) {
      navigate("/dashboard/inventory");
    }
  }, [item, navigate]);

  if (!item) {
    return null;
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
          Inventory Item Details
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700">
          <div>
            <CardTitle>{item.name}</CardTitle>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Category: {item.category}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
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
              onClick={() => {
                if (confirm("Are you sure you want to delete this item?")) {
                  navigate("/dashboard/inventory");
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-4">
              Details
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
                  Category
                </p>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {item.category}
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
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-4">
              Inventory Status
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Quantity
                </p>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {item.quantity} units
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Price
                </p>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  ${item.price.toFixed(2)} per unit
                </p>
              </div>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}