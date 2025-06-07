import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CategoryForm } from "../../../components/categories/category-form";
import { CategoryList } from "../../../components/categories/category-list";
import { useGlobal } from "../../../contexts/global-context";
import { Category, categoryService } from "../../../services/category.service";

export function CategoryListPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useGlobal();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      showError("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        setIsLoading(true);
        await categoryService.deleteCategory(category.id);
        showSuccess("Category deleted successfully");
        await fetchCategories(); // Refresh the list
      } catch (error) {
        showError("Failed to delete category");
        console.error("Error deleting category:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSuccess = async () => {
    handleClose();
    await fetchCategories(); // Refresh the list after successful save
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage product categories and classifications
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="flex items-center"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={editingCategory ?? undefined}
              onCancel={handleClose}
              onSuccess={handleSuccess}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      ) : (
        <CategoryList 
          categories={categories}
          onEdit={handleEdit} 
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}