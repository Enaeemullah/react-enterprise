import React, { useRef, useState } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { read, utils } from 'xlsx';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

interface BulkUploadProps {
  onUpload: (data: any[]) => Promise<void>;
  template?: string;
}

export function BulkUpload({ onUpload, template }: BulkUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

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
        throw new Error(t('inventory.bulkUpload.emptyFile'));
      }

      await onUpload(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('inventory.bulkUpload.error'));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    if (!template) return;
    
    const link = document.createElement('a');
    link.href = template;
    link.download = 'inventory-template.xlsx';
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('inventory.bulkUpload.dragDrop')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('inventory.bulkUpload.fileTypes')}
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
            className="mt-4"
            isLoading={isLoading}
          >
            <FileUp className="h-4 w-4 mr-2" />
            {t('inventory.bulkUpload.selectFile')}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-error-600 dark:text-error-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {template && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={downloadTemplate}>
            {t('inventory.bulkUpload.downloadTemplate')}
          </Button>
        </div>
      )}
    </div>
  );
}