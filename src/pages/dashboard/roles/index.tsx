import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { RoleForm } from "../../../components/roles/role-form";
import { RoleList } from "../../../components/roles/role-list";

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function RolesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Roles
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user roles and permissions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingRole ? "Edit Role" : "Add New Role"}</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleForm
              role={editingRole}
              onClose={handleClose}
              onSuccess={handleClose}
            />
          </CardContent>
        </Card>
      ) : (
        <RoleList onEdit={handleEdit} />
      )}
    </div>
  );
}