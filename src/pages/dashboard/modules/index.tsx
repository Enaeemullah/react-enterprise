import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ModuleForm } from "../../../components/modules/module-form";
import { ModuleList } from "../../../components/modules/module-list";
import { generateId } from "../../../lib/utils";

export interface Module {
  id: string;
  name: string;
  description: string;
  path: string;
  icon?: string;
  status: "active" | "inactive";
  order: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

const initialModules: Module[] = [
  {
    id: generateId(),
    name: "Dashboard",
    description: "Main dashboard module",
    path: "/dashboard",
    icon: "layout-dashboard",
    status: "active",
    order: 0,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Users",
    description: "User management module",
    path: "/users",
    icon: "users",
    status: "active",
    order: 1,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function ModulesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[]>(initialModules);

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setShowForm(true);
  };

  const handleDelete = (module: Module) => {
    setModules(modules.filter((m) => m.id !== module.id));
  };

  const handleView = (module: Module) => {
    // Implement view functionality
    console.log("Viewing module:", module);
  };

  const handleSubmit = async (data: Omit<Module, "id" | "createdAt" | "updatedAt" | "lastUpdated">) => {
    if (editingModule) {
      // Update existing module
      setModules(modules.map((m) =>
        m.id === editingModule.id
          ? {
              ...m,
              ...data,
              updatedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            }
          : m
      ));
    } else {
      // Add new module
      const newModule: Module = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setModules([...modules, newModule]);
    }
    setShowForm(false);
    setEditingModule(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingModule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Modules
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage system modules and their configurations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingModule ? "Edit Module" : "Add New Module"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleForm
              module={editingModule ?? undefined}
              onSubmit={handleSubmit}
              isLoading={false}
            />
          </CardContent>
        </Card>
      ) : (
        <ModuleList
          modules={modules}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}