import React, { useState } from "react";
import { Search, X, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerSearchModalProps {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  onAddNew: () => void;
}

// Mock customers data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543"
  }
];

export function CustomerSearchModal({ onClose, onSelect, onAddNew }: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = MOCK_CUSTOMERS.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Select Customer
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => onSelect(customer)}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {customer.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {customer.email} • {customer.phone}
              </div>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No customers found
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            onClick={onAddNew}
            className="w-full flex items-center justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Customer
          </Button>
        </div>
      </div>
    </div>
  );
}