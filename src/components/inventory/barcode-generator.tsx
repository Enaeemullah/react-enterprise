import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

interface BarcodeGeneratorProps {
  value: string;
  type: 'barcode' | 'qrcode';
  onDownload?: (dataUrl: string) => void;
}

export function BarcodeGenerator({ value, type, onDownload }: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    if (type === 'barcode') {
      JsBarcode(canvasRef.current, value, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10,
      });
    } else {
      QRCode.toCanvas(canvasRef.current, value, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    }
  }, [value, type]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    if (onDownload) {
      onDownload(dataUrl);
    } else {
      const link = document.createElement('a');
      link.download = `${type}-${value}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} />
      <Button onClick={handleDownload}>
        {t('inventory.download')} {type === 'barcode' ? t('inventory.barcode') : t('inventory.qrCode')}
      </Button>
    </div>
  );
}