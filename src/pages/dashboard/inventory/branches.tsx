import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { BranchForm } from "../../../components/branches/branch-form";
import { BranchList } from "../../../components/branches/branch-list";
import { branchService, Branch } from "../../../services/branch.service";
import { useGlobal } from "../../../contexts/global-context";
import { useNotifications } from "../../../contexts/notification-context";

export function BranchListPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useGlobal();
  const { notifyDelete } = useNotifications();

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const data = await branchService.getBranches();
      setBranches(data);
    } catch (error) {
      showError("Failed to fetch branches");
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleDelete = async (branch: Branch) => {
    try {
      setIsLoading(true);
      await branchService.deleteBranch(branch.id);
      showSuccess("Branch deleted successfully");
      notifyDelete("Branch", branch.name, true);
      await fetchBranches(); // Refresh the list
    } catch (error) {
      showError("Failed to delete branch");
      notifyDelete("Branch", branch.name, false);
      console.error("Error deleting branch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingBranch(null);
  };

  const handleSuccess = async () => {
    handleClose();
    await fetchBranches(); // Refresh the list after successful save
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Branches
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your organization's branches and locations
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="flex items-center"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBranch ? "Edit Branch" : "Add New Branch"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BranchForm
              branch={editingBranch ?? undefined}
              onCancel={handleClose}
              onSuccess={handleSuccess}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      ) : (
        <BranchList 
          branches={branches}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}