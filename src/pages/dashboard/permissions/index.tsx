import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PermissionForm } from "../../../components/permissions/permission-form";
import { PermissionList } from "../../../components/permissions/permission-list";

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export function PermissionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPermission(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Permissions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage system permissions and access controls
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPermission ? "Edit Permission" : "Add New Permission"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionForm
              permission={editingPermission}
              onClose={handleClose}
              onSuccess={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <PermissionList onEdit={handleEdit} />
      )}
    </div>
  );
}