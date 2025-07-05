import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyService } from "../../../services/currency.service";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";

const currencySchema = z.object({
  code: z.string().min(1, "Code is required"),
  shortName: z.string().min(1, "Short name is required"),
  description: z.string().min(1, "Description is required"),
});

type CurrencyFormValues = z.infer<typeof currencySchema>;

export function CurrenciesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencies, setCurrencies] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
  });

  // Fetch currencies on component mount
  useEffect(() => {
    const loadCurrencies = async () => {
      setIsLoading(true);
      try {
        const data = await currencyService.getCurrencies();
        setCurrencies(data);
        if (data.length > 0) {
          setValue("code", data[0].code);
          setValue("shortName", data[0].shortName);
          setValue("description", data[0].description);
        }
      } catch (error) {
        toast.error("Failed to load currencies");
      } finally {
        setIsLoading(false);
      }
    };
    loadCurrencies();
  }, [setValue]);

  const onSubmit = async (data: CurrencyFormValues) => {
    setIsSubmitting(true);
    try {
      // Check if we're updating an existing currency or creating new
      const existingCurrency = currencies.find(c => c.code === data.code);
      
      if (existingCurrency) {
        await currencyService.updateCurrency(existingCurrency.id, data);
        toast.success("Currency updated successfully");
      } else {
        await currencyService.createCurrency(data);
        toast.success("Currency created successfully");
      }
      
      // Refresh the list
      const updatedCurrencies = await currencyService.getCurrencies();
      setCurrencies(updatedCurrencies);
    } catch (error) {
      toast.error("Failed to save currency");
    } finally {
      setIsSubmitting(false);
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
            Manage currency codes and descriptions
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Currency Management</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Code"
                  placeholder="101"
                  error={errors.code?.message}
                  {...register("code")}
                />
                
                <Input
                  label="Short Name"
                  placeholder="PKR"
                  error={errors.shortName?.message}
                  {...register("shortName")}
                />
                
                <Input
                  label="Description"
                  placeholder="Pakistani Rupees"
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isLoading || isSubmitting}
                >
                  Reset
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Currency List */}
      {currencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Short Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currencies.map((currency, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {currency.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {currency.shortName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {currency.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}