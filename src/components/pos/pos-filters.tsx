import React from "react";
import { Search, Grid, List } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface POSFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  sortOrder: string;
  onSortChange: (value: string) => void;
  categories: string[];
  filteredCount: number;
  totalCount: number;
}

export function POSFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  sortBy,
  sortOrder,
  onSortChange,
  categories,
  filteredCount,
  totalCount,
}: POSFiltersProps) {
  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
      
      {/* View Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="quantity-asc">Stock Low-High</option>
            <option value="quantity-desc">Stock High-Low</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredCount} of {totalCount} products
        </div>
      </div>
    </>
  );
}