import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

// Mock data for demonstration
const MOCK_SUPPLIERS = [
  {
    id: "1",
    name: "Tech Supplies Co",
    contactPerson: "John Smith",
    email: "john@techsupplies.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street",
    city: "San Francisco",
    state: "CA",
    country: "United States",
    zipCode: "94105",
    status: "active" as const,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Global Electronics",
    contactPerson: "Jane Doe",
    email: "jane@globalelec.com",
    phone: "+1 (555) 987-6543",
    address: "456 Electronics Ave",
    city: "New York",
    state: "NY",
    country: "United States",
    zipCode: "10001",
    status: "active" as const,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
];

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface SupplierListProps {
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierList({ onEdit, onDelete }: SupplierListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {MOCK_SUPPLIERS.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {supplier.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {supplier.contactPerson}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {supplier.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {supplier.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {supplier.city}, {supplier.state}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {supplier.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      supplier.status === "active"
                        ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                        : "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400"
                    }`}
                  >
                    {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(supplier)}
                      className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(supplier)}
                      className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}