import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { BrandForm } from "../../../components/brands/brand-form";
import { BrandList } from "../../../components/brands/brand-list";
import { brandService, Brand } from "../../../services/brand.service";
import { useGlobal } from "../../../contexts/global-context";

export function BrandListPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useGlobal();

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (error) {
      showError("Failed to fetch brands");
      console.error("Error fetching brands:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      try {
        setIsLoading(true);
        await brandService.deleteBrand(brand.id);
        showSuccess("Brand deleted successfully");
        await fetchBrands(); // Refresh the list
      } catch (error) {
        showError("Failed to delete brand");
        console.error("Error deleting brand:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleSuccess = async () => {
    handleClose();
    await fetchBrands(); // Refresh the list after successful save
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Brands
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage product brands and manufacturers
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="flex items-center"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BrandForm
              brand={editingBrand ?? undefined}
              onCancel={handleClose}
              onSuccess={handleSuccess}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      ) : (
        <BrandList 
          brands={brands}
          onEdit={handleEdit} 
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}