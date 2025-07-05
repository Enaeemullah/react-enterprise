import React, { useState } from "react";
import { Plus, DollarSign, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CurrencyForm, Currency } from "../../../components/currencies/currency-form";
import { CurrencyList } from "../../../components/currencies/currency-list";

export function CurrenciesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCurrency(null);
  };

  const handleUpdateExchangeRates = async () => {
    setIsUpdatingRates(true);
    try {
      // Simulate API call to update exchange rates
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Exchange rates updated");
    } catch (error) {
      console.error("Failed to update exchange rates:", error);
    } finally {
      setIsUpdatingRates(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Currencies
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage currencies and exchange rates for international transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleUpdateExchangeRates}
            variant="outline"
            className="flex items-center"
            isLoading={isUpdatingRates}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Rates
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Currencies
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  4
                </h3>
              </div>
              <div className="rounded-full bg-primary-50 dark:bg-primary-900/20 p-3">
                <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Currencies
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  4
                </h3>
              </div>
              <div className="rounded-full bg-success-50 dark:bg-success-900/20 p-3">
                <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Base Currency
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  USD
                </h3>
              </div>
              <div className="rounded-full bg-warning-50 dark:bg-warning-900/20 p-3">
                <DollarSign className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Today
                </h3>
              </div>
              <div className="rounded-full bg-secondary-50 dark:bg-secondary-900/20 p-3">
                <RefreshCw className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCurrency ? "Edit Currency" : "Add New Currency"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyForm
              currency={editingCurrency}
              onClose={handleClose}
              onSuccess={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <CurrencyList onEdit={handleEdit} />
      )}
    </div>
  );
}