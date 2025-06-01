import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle as CircleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useInventory } from "../../contexts/inventory-context";
import { useAuth } from "../../contexts/auth-context";

export function DashboardHomePage() {
  const { user } = useAuth();
  const { items } = useInventory();

  // Calculate dashboard metrics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lowStockItems = items.filter(
    (item) => item.status === "low-stock" || item.status === "out-of-stock"
  ).length;
  const topCategories = [...new Set(items.map((item) => item.category))].slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Link to="/dashboard/inventory/add">
            <Button size="sm" className="flex items-center">
              <Package className="mr-1 h-4 w-4" />
              Add Inventory
            </Button>
          </Link>
          <Link to="/dashboard/reports">
            <Button size="sm" variant="outline" className="flex items-center">
              <BarChart3 className="mr-1 h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Inventory
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {totalItems} items
                </h3>
              </div>
              <div className="rounded-full bg-primary-50 dark:bg-primary-900/20 p-3">
                <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/inventory" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View all inventory
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Inventory Value
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  ${totalValue.toFixed(2)}
                </h3>
              </div>
              <div className="rounded-full bg-secondary-50 dark:bg-secondary-900/20 p-3">
                <DollarSign className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>Based on current prices</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Low Stock Items
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {lowStockItems} items
                </h3>
              </div>
              <div className="rounded-full bg-warning-50 dark:bg-warning-900/20 p-3">
                <CircleAlert className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/inventory" className="text-sm text-warning-600 dark:text-warning-400 hover:underline">
                View low stock items
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Services
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  5 active
                </h3>
              </div>
              <div className="rounded-full bg-accent-50 dark:bg-accent-900/20 p-3">
                <ShoppingCart className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/services" className="text-sm text-accent-600 dark:text-accent-400 hover:underline">
                Manage services
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 mt-1 rounded-full bg-primary-50 dark:bg-primary-900/20 p-2">
                  <Package className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New inventory item added
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Someone added "Wireless Mouse" to inventory
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1 rounded-full bg-secondary-50 dark:bg-secondary-900/20 p-2">
                  <Users className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New team member
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jane Smith joined the team
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    1 day ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1 rounded-full bg-accent-50 dark:bg-accent-900/20 p-2">
                  <ShoppingCart className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New service created
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    "IT Support" service has been added
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                        : index === 1
                        ? "bg-secondary-50 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400"
                        : "bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {category}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {items.filter((item) => item.category === category).length} items
                    </p>
                  </div>
                  <div className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
                    $
                    {items
                      .filter((item) => item.category === category)
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </div>
                </div>
              ))}
              
              {topCategories.length === 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  No categories found.
                </p>
              )}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/dashboard/inventory/categories">
                  <Button variant="outline" className="w-full">
                    View all categories
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}