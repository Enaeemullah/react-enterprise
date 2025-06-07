import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BarcodeGenerator } from "./barcode-generator";
import { InventoryItem } from "../../contexts/inventory-context";
import { CreateInventoryItemDTO } from "../../services/inventory.service";
import { brandService, Brand } from "../../services/brand.service";
import { categoryService, Category } from "../../services/category.service";
import { useGlobal } from "../../contexts/global-context";
import { useTranslation } from "react-i18next";

const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  categoryId: z.number().optional(),
  stockQuantity: z.number().min(0, "Stock quantity must be 0 or greater"),
  sellingPrice: z.number().min(0, "Selling price must be 0 or greater"),
  costPrice: z.number().min(0, "Cost price must be 0 or greater").optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  brandId: z.number().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: CreateInventoryItemDTO) => Promise<void>;
  isLoading: boolean;
}

export function InventoryForm({ item, onSubmit, isLoading }: InventoryFormProps) {
  const { t } = useTranslation();
  const { showError } = useGlobal();
  const isEditMode = !!item;
  const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dropdown data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      categoryId: item?.categoryId || undefined,
      stockQuantity: item?.quantity || item?.stockQuantity || 0,
      sellingPrice: item?.price || item?.sellingPrice || 0,
      costPrice: item?.costPrice || 0,
      sku: item?.sku || "",
      brandId: item?.brandId || undefined,
      imageUrl: item?.imageUrl || "",
    },
  });

  const sku = watch("sku");

  // Fetch brands and categories on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      // Fetch brands
      try {
        setLoadingBrands(true);
        const brandsData = await brandService.getBrands();
        setBrands(brandsData.filter(brand => brand.status === 'active'));
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        showError('Failed to load brands');
      } finally {
        setLoadingBrands(false);
      }

      // Fetch categories
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData.filter(category => category.status === 'active'));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        showError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchDropdownData();
  }, [showError]);

  const handleFormSubmit = async (data: InventoryFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data as CreateInventoryItemDTO);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewBrand = () => {
    // Navigate to add brand page or open modal
    window.open('/dashboard/inventory/brands', '_blank');
  };

  const handleAddNewCategory = () => {
    // Navigate to add category page or open modal
    window.open('/dashboard/inventory/categories', '_blank');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            error={errors.name?.message}
            {...register("name")}
          />
          
          <Input
            label="SKU"
            placeholder="Enter SKU"
            error={errors.sku?.message}
            rightElement={
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBarcodeGenerator(true)}
                >
                  Barcode
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQRGenerator(true)}
                >
                  QR Code
                </Button>
              </div>
            }
            {...register("sku")}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Enter product description"
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Brand Dropdown */}
          <div>
            <label
              htmlFor="brandId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Brand
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <select
                  id="brandId"
                  className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  {...register("brandId", { 
                    setValueAs: (value) => value === "" ? undefined : parseInt(value, 10)
                  })}
                  disabled={loadingBrands}
                >
                  <option value="">
                    {loadingBrands ? "Loading brands..." : "Select a brand"}
                  </option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {loadingBrands && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNewBrand}
                className="flex items-center px-3"
                title="Add new brand"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.brand?.message && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.brand.message}
              </p>
            )}
          </div>
          
          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <select
                  id="categoryId"
                  className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  {...register("categoryId", { 
                    setValueAs: (value) => value === "" ? undefined : parseInt(value, 10)
                  })}
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {loadingCategories && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNewCategory}
                className="flex items-center px-3"
                title="Add new category"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.categoryId?.message && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Stock Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Pricing & Stock
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input
            type="number"
            label="Stock Quantity"
            min={0}
            error={errors.stockQuantity?.message}
            {...register("stockQuantity", { valueAsNumber: true })}
          />
          
          <Input
            type="number"
            label="Selling Price ($)"
            min={0}
            step={0.01}
            error={errors.sellingPrice?.message}
            {...register("sellingPrice", { valueAsNumber: true })}
          />
          
          <Input
            type="number"
            label="Cost Price ($)"
            min={0}
            step={0.01}
            error={errors.costPrice?.message}
            {...register("costPrice", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Additional Information
        </h3>
        
        <Input
          label="Image URL"
          type="url"
          placeholder="https://example.com/image.jpg"
          error={errors.imageUrl?.message}
          {...register("imageUrl")}
        />
      </div>

      {/* Barcode/QR Code Generators */}
      {showBarcodeGenerator && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Barcode Generator</h3>
          <BarcodeGenerator value={sku} type="barcode" />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setShowBarcodeGenerator(false)}
          >
            Close
          </Button>
        </div>
      )}

      {showQRGenerator && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">QR Code Generator</h3>
          <BarcodeGenerator value={sku} type="qrcode" />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setShowQRGenerator(false)}
          >
            Close
          </Button>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          {isEditMode ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}