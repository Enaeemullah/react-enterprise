import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/utils";

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface BranchListProps {
  onEdit: (branch: Branch) => void;
}

// Mock data for demonstration
const MOCK_BRANCHES: Branch[] = [
  {
    id: "1",
    name: "Main Branch",
    code: "MB001",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    country: "United States",
    zipCode: "10001",
    phone: "+1 (555) 123-4567",
    email: "main@example.com",
    status: "active",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Downtown Branch",
    code: "DB002",
    address: "456 Market Street",
    city: "San Francisco",
    state: "CA",
    country: "United States",
    zipCode: "94105",
    phone: "+1 (555) 987-6543",
    email: "downtown@example.com",
    status: "active",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
];

export function BranchList({ onEdit }: BranchListProps) {
  const handleDelete = async (branch: Branch) => {
    if (confirm(`Are you sure you want to delete the branch "${branch.name}"?`)) {
      // Here you would make an API call to delete the branch
      console.log("Deleting branch:", branch.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Branch Info
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
            {MOCK_BRANCHES.map((branch) => (
              <tr key={branch.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {branch.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Code: {branch.code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {branch.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {branch.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {branch.address}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {branch.city}, {branch.state} {branch.zipCode}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {branch.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    branch.status === "active"
                      ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                      : "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400"
                  }`}>
                    {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(branch)}
                      className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(branch)}
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