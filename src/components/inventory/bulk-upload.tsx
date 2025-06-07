import React, { useRef, useState } from 'react';
import { Upload, FileUp, AlertCircle, Download, FileText } from 'lucide-react';
import { read, utils, writeFile } from 'xlsx';
import { Button } from '../ui/button';
import { BulkUploadPreview } from './bulk-upload-preview';
import { useTranslation } from 'react-i18next';

interface BulkUploadItem {
  id: string;
  name: string;
  description: string;
  categoryId?: number;
  stockQuantity: number;
  sellingPrice: number;
  costPrice?: number;
  sku: string;
  brand?: string;
  branchId?: number;
  imageUrl?: string;
  isValid: boolean;
  errors: string[];
  isSelected: boolean;
}

interface BulkUploadProps {
  onUpload: (data: BulkUploadItem[]) => Promise<void>;
  template?: string;
}

export function BulkUpload({ onUpload, template }: BulkUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedItems, setParsedItems] = useState<BulkUploadItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { t } = useTranslation();

  const validateItem = (row: any, index: number): { item: BulkUploadItem; isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required field validation
    if (!row.Name || typeof row.Name !== 'string' || row.Name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters');
    }
    
    if (!row.Description || typeof row.Description !== 'string' || row.Description.trim().length < 5) {
      errors.push('Description is required and must be at least 5 characters');
    }
    
    if (!row.SKU || typeof row.SKU !== 'string' || row.SKU.trim().length < 3) {
      errors.push('SKU is required and must be at least 3 characters');
    }
    
    if (!row.StockQuantity || isNaN(Number(row.StockQuantity)) || Number(row.StockQuantity) < 0) {
      errors.push('StockQuantity must be a valid number >= 0');
    }
    
    if (!row.SellingPrice || isNaN(Number(row.SellingPrice)) || Number(row.SellingPrice) < 0) {
      errors.push('SellingPrice must be a valid number >= 0');
    }

    // Optional field validation
    if (row.CategoryId && (isNaN(Number(row.CategoryId)) || Number(row.CategoryId) < 1)) {
      errors.push('CategoryId must be a valid number >= 1');
    }
    
    if (row.BranchId && (isNaN(Number(row.BranchId)) || Number(row.BranchId) < 1)) {
      errors.push('BranchId must be a valid number >= 1');
    }
    
    if (row.CostPrice && (isNaN(Number(row.CostPrice)) || Number(row.CostPrice) < 0)) {
      errors.push('CostPrice must be a valid number >= 0');
    }

    if (row.ImageUrl && row.ImageUrl.trim() && !isValidUrl(row.ImageUrl.trim())) {
      errors.push('ImageUrl must be a valid URL');
    }

    const item: BulkUploadItem = {
      id: `item-${index}`,
      name: row.Name?.toString().trim() || '',
      description: row.Description?.toString().trim() || '',
      categoryId: row.CategoryId ? Number(row.CategoryId) : undefined,
      stockQuantity: Number(row.StockQuantity) || 0,
      sellingPrice: Number(row.SellingPrice) || 0,
      costPrice: row.CostPrice ? Number(row.CostPrice) : undefined,
      sku: row.SKU?.toString().trim() || '',
      brand: row.Brand?.toString().trim() || undefined,
      branchId: row.BranchId ? Number(row.BranchId) : undefined,
      imageUrl: row.ImageUrl?.toString().trim() || undefined,
      isValid: errors.length === 0,
      errors,
      isSelected: errors.length === 0, // Auto-select valid items
    };

    return { item, isValid: errors.length === 0, errors };
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('The uploaded file is empty or has no valid data');
      }

      // Validate and process each item
      const processedItems: BulkUploadItem[] = [];
      const skuSet = new Set<string>();
      
      jsonData.forEach((row, index) => {
        const { item } = validateItem(row, index);
        
        // Check for duplicate SKUs
        if (item.sku && skuSet.has(item.sku.toLowerCase())) {
          item.errors.push('Duplicate SKU found in file');
          item.isValid = false;
          item.isSelected = false;
        } else if (item.sku) {
          skuSet.add(item.sku.toLowerCase());
        }
        
        processedItems.push(item);
      });

      setParsedItems(processedItems);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePreviewSubmit = async (selectedItems: BulkUploadItem[]) => {
    await onUpload(selectedItems);
    setShowPreview(false);
    setParsedItems([]);
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
    setParsedItems([]);
  };

  const downloadEmptyTemplate = () => {
    // Create empty template with just headers and one example row
    const templateData = [
      {
        Name: 'Example Product',
        Description: 'Example product description',
        CategoryId: 1,
        StockQuantity: 100,
        SellingPrice: 29.99,
        CostPrice: 15.00,
        SKU: 'EXAMPLE-001',
        Brand: 'Example Brand',
        BranchId: 1,
        ImageUrl: 'https://example.com/image.jpg'
      }
    ];

    const ws = utils.json_to_sheet(templateData);
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 50 }, // Description
      { wch: 12 }, // CategoryId
      { wch: 15 }, // StockQuantity
      { wch: 15 }, // SellingPrice
      { wch: 12 }, // CostPrice
      { wch: 18 }, // SKU
      { wch: 15 }, // Brand
      { wch: 12 }, // BranchId
      { wch: 60 }, // ImageUrl
    ];
    ws['!cols'] = colWidths;

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Inventory Template');
    
    writeFile(wb, 'inventory-bulk-upload-template.xlsx');
  };

  if (showPreview) {
    return (
      <BulkUploadPreview
        items={parsedItems}
        onSubmit={handlePreviewSubmit}
        onCancel={handlePreviewCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          📋 Bulk Upload Instructions
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Download the template below to get started</li>
          <li>• <strong>Required fields:</strong> Name, Description, StockQuantity, SellingPrice, SKU</li>
          <li>• <strong>Optional fields:</strong> CategoryId, CostPrice, Brand, BranchId, ImageUrl</li>
          <li>• Save as Excel (.xlsx) or CSV format</li>
          <li>• Maximum 1000 items per upload</li>
          <li>• Ensure SKUs are unique across all products</li>
        </ul>
      </div>

      {/* Template Download */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Download Template
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Download the Excel template with proper headers and format
        </p>
        <Button
          variant="outline"
          onClick={downloadEmptyTemplate}
          className="flex items-center space-x-2 mx-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download Template</span>
        </Button>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Upload your inventory file
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Supported formats: XLSX, XLS, CSV (Max size: 10MB)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
          />
          
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <FileUp className="h-4 w-4" />
            <span>{isLoading ? 'Processing...' : 'Select File'}</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-start space-x-3 p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-error-800 dark:text-error-200">
              Upload Error
            </h4>
            <p className="text-sm text-error-700 dark:text-error-300 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Field Reference */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          📝 Field Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">✅ Required Fields:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li><strong>Name:</strong> Product name (2-100 characters)</li>
              <li><strong>Description:</strong> Product description (5-500 characters)</li>
              <li><strong>StockQuantity:</strong> Number of items in stock (integer)</li>
              <li><strong>SellingPrice:</strong> Price to sell (decimal, e.g., 29.99)</li>
              <li><strong>SKU:</strong> Unique product identifier (3-50 characters)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">⚪ Optional Fields:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li><strong>CategoryId:</strong> Category ID (integer, 1-999)</li>
              <li><strong>CostPrice:</strong> Cost price (decimal, e.g., 15.50)</li>
              <li><strong>Brand:</strong> Product brand (text)</li>
              <li><strong>BranchId:</strong> Branch ID (integer, 1-999)</li>
              <li><strong>ImageUrl:</strong> Product image URL (valid URL)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}