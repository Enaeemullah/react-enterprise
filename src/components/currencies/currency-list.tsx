import React from "react";
import { Edit, Trash2, Star, StarOff } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/utils";
import type { Currency } from "./currency-form";

// Mock data for demonstration
const MOCK_CURRENCIES: Currency[] = [
  {
    id: "1",
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchangeRate: 1.0,
    isBaseCurrency: true,
    status: "active",
    decimalPlaces: 2,
    country: "United States",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchangeRate: 0.85,
    isBaseCurrency: false,
    status: "active",
    decimalPlaces: 2,
    country: "European Union",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "3",
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    exchangeRate: 0.73,
    isBaseCurrency: false,
    status: "active",
    decimalPlaces: 2,
    country: "United Kingdom",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "4",
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    exchangeRate: 110.25,
    isBaseCurrency: false,
    status: "active",
    decimalPlaces: 0,
    country: "Japan",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
];

interface CurrencyListProps {
  onEdit: (currency: Currency) => void;
}

export function CurrencyList({ onEdit }: CurrencyListProps) {
  const handleDelete = async (currency: Currency) => {
    if (currency.isBaseCurrency) {
      alert("Cannot delete the base currency. Please set another currency as base first.");
      return;
    }
    
    if (confirm(`Are you sure you want to delete the currency "${currency.name}"?`)) {
      // Here you would make an API call to delete the currency
      console.log("Deleting currency:", currency.id);
    }
  };

  const handleToggleBaseCurrency = async (currency: Currency) => {
    if (currency.isBaseCurrency) {
      alert("This is already the base currency.");
      return;
    }
    
    if (confirm(`Set "${currency.name}" as the base currency? This will update all exchange rates.`)) {
      // Here you would make an API call to set as base currency
      console.log("Setting as base currency:", currency.id);
    }
  };

  const formatExchangeRate = (rate: number, decimalPlaces: number) => {
    return rate.toFixed(Math.max(decimalPlaces, 4));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Currency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Exchange Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {MOCK_CURRENCIES.map((currency) => (
              <tr key={currency.id} className={currency.isBaseCurrency ? "bg-primary-50 dark:bg-primary-900/20" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {currency.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {currency.code}
                        </div>
                        {currency.isBaseCurrency && (
                          <Star className="ml-2 h-4 w-4 text-warning-500 fill-current" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {currency.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {currency.isBaseCurrency ? "1.0000 (Base)" : formatExchangeRate(currency.exchangeRate, currency.decimalPlaces)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currency.decimalPlaces} decimal places
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    currency.status === "active"
                      ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {currency.status.charAt(0).toUpperCase() + currency.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(new Date(currency.updatedAt))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {!currency.isBaseCurrency && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBaseCurrency(currency)}
                        className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                        title="Set as base currency"
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(currency)}
                      className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(currency)}
                      className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                      disabled={currency.isBaseCurrency}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}