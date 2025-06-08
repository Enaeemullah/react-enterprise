import React, { useRef, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Receipt } from "./receipt";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ReceiptModalProps {
  transaction: {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    transactionId: string;
    date: Date;
    customer?: Customer;
  };
  onClose: () => void;
  onNewTransaction: () => void;
  cashierName: string;
}

export function ReceiptModal({ transaction, onClose, onNewTransaction, cashierName }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                body {
                  font-family: monospace;
                  margin: 0;
                  padding: 20px;
                  width: 300px;
                }
                pre {
                  white-space: pre-wrap;
                  margin: 0;
                  font-size: 12px;
                  line-height: 1.2;
                }
                @media print {
                  body {
                    width: 80mm;
                  }
                  @page {
                    margin: 0;
                    size: 80mm auto;
                  }
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(handlePrint, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Receipt
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={receiptRef}>
          <Receipt
            {...transaction}
            cashierName={cashierName}
            storeName="Enterprise Store"
            storeAddress="123 Main St, City, State 12345"
            storePhone="(555) 123-4567"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print Again
          </Button>
          <Button onClick={onNewTransaction}>
            New Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}