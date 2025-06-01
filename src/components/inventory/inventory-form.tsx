import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BarcodeGenerator } from "./barcode-generator";
import { InventoryItem } from "../../contexts/inventory-context";
import { CreateInventoryItemDTO } from "../../services/inventory.service";
import { useTranslation } from "react-i18next";

const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  price: z.number().min(0, "Price must be 0 or greater"),
  status: z.enum(["in-stock", "low-stock", "out-of-stock"]),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional(),
  reorderPoint: z.number().min(0, "Reorder point must be 0 or greater"),
  unit: z.string().min(1, "Unit is required"),
  supplier: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: CreateInventoryItemDTO) => Promise<void>;
  isLoading: boolean;
}

export function InventoryForm({ item, onSubmit, isLoading }: InventoryFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!item;
  const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [tags, setTags] = useState<string[]>(item?.tags || []);
  
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
      category: item?.category || "",
      quantity: item?.quantity || 0,
      price: item?.price || 0,
      status: item?.status || "in-stock",
      sku: item?.sku || "",
      barcode: item?.barcode || "",
      reorderPoint: item?.reorderPoint || 5,
      unit: item?.unit || "pieces",
      supplier: item?.supplier || "",
      location: item?.location || "",
      tags: item?.tags || [],
    },
  });

  const quantity = watch("quantity");
  const reorderPoint = watch("reorderPoint");
  const sku = watch("sku");

  // Automatically update status based on quantity and reorder point
  const calculateStatus = (qty: number, reorderPt: number): "in-stock" | "low-stock" | "out-of-stock" => {
    if (qty <= 0) return "out-of-stock";
    if (qty <= reorderPt) return "low-stock";
    return "in-stock";
  };

  const handleFormSubmit = async (data: InventoryFormValues) => {
    const status = calculateStatus(data.quantity, data.reorderPoint);
    await onSubmit({ ...data, status, tags });
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault();
      const newTag = event.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setValue('tags', updatedTags);
        event.currentTarget.value = '';
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t("inventory.basicInfo")}
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label={t("inventory.name")}
            placeholder={t("inventory.namePlaceholder")}
            error={errors.name?.message}
            {...register("name")}
          />
          
          <Input
            label={t("inventory.sku")}
            placeholder={t("inventory.skuPlaceholder")}
            error={errors.sku?.message}
            rightElement={
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBarcodeGenerator(true)}
                >
                  {t("inventory.generateBarcode")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQRGenerator(true)}
                >
                  {t("inventory.generateQR")}
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
            {t("inventory.description")}
          </label>
          <textarea
            id="description"
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder={t("inventory.descriptionPlaceholder")}
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Stock Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t("inventory.stockInfo")}
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input
            type="number"
            label={t("inventory.quantity")}
            min={0}
            error={errors.quantity?.message}
            {...register("quantity", { valueAsNumber: true })}
          />
          
          <Input
            type="number"
            label={t("inventory.price")}
            min={0}
            step={0.01}
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          
          <Input
            type="number"
            label={t("inventory.reorderPoint")}
            min={0}
            error={errors.reorderPoint?.message}
            {...register("reorderPoint", { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label={t("inventory.unit")}
            placeholder={t("inventory.unitPlaceholder")}
            error={errors.unit?.message}
            {...register("unit")}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("inventory.status")}
            </label>
            <div className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("inventory.statusAutomatic")}
              </p>
              <div className="mt-2 font-medium">
                {t("inventory.currentStatus")}:{" "}
                <span className={`
                  ${calculateStatus(quantity, reorderPoint) === "in-stock" && "text-success-600 dark:text-success-400"}
                  ${calculateStatus(quantity, reorderPoint) === "low-stock" && "text-warning-600 dark:text-warning-400"}
                  ${calculateStatus(quantity, reorderPoint) === "out-of-stock" && "text-error-600 dark:text-error-400"}
                `}>
                  {t(`inventory.status${calculateStatus(quantity, reorderPoint)}`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t("inventory.additionalInfo")}
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label={t("inventory.category")}
            placeholder={t("inventory.categoryPlaceholder")}
            error={errors.category?.message}
            {...register("category")}
          />
          
          <Input
            label={t("inventory.supplier")}
            placeholder={t("inventory.supplierPlaceholder")}
            error={errors.supplier?.message}
            {...register("supplier")}
          />
        </div>

        <Input
          label={t("inventory.location")}
          placeholder={t("inventory.locationPlaceholder")}
          error={errors.location?.message}
          {...register("location")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("inventory.tags")}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder={t("inventory.tagsPlaceholder")}
            onKeyDown={handleTagAdd}
          />
        </div>
      </div>

      {/* Barcode/QR Code Generators */}
      {showBarcodeGenerator && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">{t("inventory.barcodeGenerator")}</h3>
          <BarcodeGenerator value={sku} type="barcode" />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setShowBarcodeGenerator(false)}
          >
            {t("common.close")}
          </Button>
        </div>
      )}

      {showQRGenerator && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">{t("inventory.qrGenerator")}</h3>
          <BarcodeGenerator value={sku} type="qrcode" />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setShowQRGenerator(false)}
          >
            {t("common.close")}
          </Button>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          {t("common.cancel")}
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? t("inventory.updateItem") : t("inventory.addItem")}
        </Button>
      </div>
    </form>
  );
}