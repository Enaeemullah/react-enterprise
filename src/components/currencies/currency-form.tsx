import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const currencySchema = z.object({
  code: z.string().min(3, "Currency code must be exactly 3 characters").max(3, "Currency code must be exactly 3 characters").toUpperCase(),
  name: z.string().min(2, "Currency name must be at least 2 characters"),
  symbol: z.string().min(1, "Currency symbol is required"),
  exchangeRate: z.number().min(0.0001, "Exchange rate must be greater than 0"),
  isBaseCurrency: z.boolean(),
  status: z.enum(["active", "inactive"]),
  decimalPlaces: z.number().min(0).max(8),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type CurrencyFormValues = z.infer<typeof currencySchema>;

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  status: "active" | "inactive";
  decimalPlaces: number;
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface CurrencyFormProps {
  currency?: Currency | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CurrencyForm({ currency, onClose, onSuccess }: CurrencyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: currency?.code || "",
      name: currency?.name || "",
      symbol: currency?.symbol || "",
      exchangeRate: currency?.exchangeRate || 1.0,
      isBaseCurrency: currency?.isBaseCurrency || false,
      status: currency?.status || "active",
      decimalPlaces: currency?.decimalPlaces || 2,
      country: currency?.country || "",
    },
  });

  const isBaseCurrency = watch("isBaseCurrency");

  const onSubmit = async (data: CurrencyFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If setting as base currency, exchange rate should be 1
      if (data.isBaseCurrency) {
        data.exchangeRate = 1.0;
      }
      
      console.log("Saving currency:", data);
      onSuccess();
    } catch (err) {
      setError("Failed to save currency. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-error-50 dark:bg-error-900/30 border border-error-300 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Currency Code"
          placeholder="USD"
          error={errors.code?.message}
          {...register("code")}
          className="uppercase"
          maxLength={3}
        />

        <Input
          label="Currency Name"
          placeholder="US Dollar"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Symbol"
          placeholder="$"
          error={errors.symbol?.message}
          {...register("symbol")}
        />

        <Input
          label="Country"
          placeholder="United States"
          error={errors.country?.message}
          {...register("country")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Exchange Rate"
          type="number"
          step="0.0001"
          min="0.0001"
          placeholder="1.0000"
          error={errors.exchangeRate?.message}
          {...register("exchangeRate", { valueAsNumber: true })}
          disabled={isBaseCurrency}
          className={isBaseCurrency ? "bg-gray-100 dark:bg-gray-700" : ""}
        />

        <Input
          label="Decimal Places"
          type="number"
          min="0"
          max="8"
          placeholder="2"
          error={errors.decimalPlaces?.message}
          {...register("decimalPlaces", { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isBaseCurrency"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            {...register("isBaseCurrency")}
          />
          <label htmlFor="isBaseCurrency" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
            Set as base currency
          </label>
        </div>
        {isBaseCurrency && (
          <p className="text-sm text-warning-600 dark:text-warning-400">
            Base currency exchange rate will be automatically set to 1.0
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register("status")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.status.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {currency ? "Update Currency" : "Create Currency"}
        </Button>
      </div>
    </form>
  );
}