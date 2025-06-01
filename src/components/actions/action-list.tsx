import React from "react";
import { Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Action } from "../../pages/dashboard/actions";

interface ActionListProps {
  onEdit: (action: Action) => void;
}

export function ActionList({ onEdit }: ActionListProps) {
  // TODO: Replace with actual data fetching
  const actions: Action[] = [
    {
      id: "1",
      name: "Create User",
      description: "Create a new user in the system",
      module: "Users",
      type: "create",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Add more sample actions as needed
  ];

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete action:", id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Module</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{action.name}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{action.description}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{action.module}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white capitalize">{action.type}</td>
              <td className="px-4 py-2">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(action)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(action.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}