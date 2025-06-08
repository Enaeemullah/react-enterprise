import React from "react";
import { X, CreditCard, Banknote } from "lucide-react";
import { Button } from "../ui/button";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface PaymentModalProps {
  total: number;
  customer: Customer | null;
  onSelectCustomer: () => void;
  onClose: () => void;
  onComplete: (method: string) => void;
}

export function PaymentModal({ total, customer, onSelectCustomer, onClose, onComplete }: PaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400">Customer</span>
            {customer ? (
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {customer.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {customer.email}
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onSelectCustomer}>
                Select Customer
              </Button>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            ${total.toFixed(2)}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => onComplete("Credit Card")}
            className="w-full flex items-center justify-center"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay with Card
          </Button>
          <Button
            onClick={() => onComplete("Cash")}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            <Banknote className="mr-2 h-5 w-5" />
            Pay with Cash
          </Button>
        </div>
      </div>
    </div>
  );
}