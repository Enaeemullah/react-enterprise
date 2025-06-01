import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ActionForm } from "../../../components/actions/action-form";
import { ActionList } from "../../../components/actions/action-list";

export interface Action {
  id: string;
  name: string;
  description: string;
  module: string;
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export function ActionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Actions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage system actions and their permissions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingAction ? "Edit Action" : "Add New Action"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={editingAction}
              onClose={handleClose}
              onSuccess={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <ActionList onEdit={handleEdit} />
      )}
    </div>
  );
}