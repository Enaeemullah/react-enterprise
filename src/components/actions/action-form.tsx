import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Action } from "../../pages/dashboard/actions";

interface ActionFormProps {
  action?: Action | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActionForm({ action, onClose, onSuccess }: ActionFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          defaultValue={action?.name}
          placeholder="Enter action name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          defaultValue={action?.description}
          placeholder="Enter action description"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="module" className="text-sm font-medium">
          Module
        </label>
        <Input
          id="module"
          defaultValue={action?.module}
          placeholder="Enter module name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Type
        </label>
        <select
          id="type"
          defaultValue={action?.type}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="create">Create</option>
          <option value="read">Read</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {action ? "Update Action" : "Create Action"}
        </Button>
      </div>
    </form>
  );
}