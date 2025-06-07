import React, { useState, useEffect } from "react";
import { Plus, Eye, Search, Filter, Download, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { BranchForm } from "../../../components/branches/branch-form";
import { BranchList } from "../../../components/branches/branch-list";
import { branchService, Branch } from "../../../services/branch.service";
import { useGlobal } from "../../../contexts/global-context";
import { useNotifications } from "../../../contexts/notification-context";

export function BranchListPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { showSuccess, showError } = useGlobal();
  const { notifyDelete } = useNotifications();

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Filter branches when search term or status filter changes
  useEffect(() => {
    filterBranches();
  }, [branches, searchTerm, statusFilter]);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const data = await branchService.getBranches();
      setBranches(data);
      console.log('Fetched branches:', data);
    } catch (error) {
      showError("Failed to fetch branches");
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBranches = () => {
    let filtered = branches;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(branch => branch.status === statusFilter);
    }

    setFilteredBranches(filtered);
  };

  const handleView = async (branch: Branch) => {
    try {
      setIsLoading(true);
      // Fetch fresh data for viewing
      const freshBranch = await branchService.getBranch(branch.id);
      setViewingBranch(freshBranch);
      setShowForm(true);
    } catch (error) {
      showError("Failed to fetch branch details");
      console.error("Error fetching branch details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (branch: Branch) => {
    try {
      setIsLoading(true);
      // Fetch fresh data for editing
      const freshBranch = await branchService.getBranch(branch.id);
      setEditingBranch(freshBranch);
      setShowForm(true);
    } catch (error) {
      showError("Failed to fetch branch details");
      console.error("Error fetching branch details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (branch: Branch) => {
    if (!confirm(`Are you sure you want to delete "${branch.name}"? This action cannot be undone.`)) {
      return;
    }

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
    setViewingBranch(null);
  };

  const handleSuccess = async () => {
    handleClose();
    await fetchBranches(); // Refresh the list after successful save
  };

  const handleExport = () => {
    try {
      const csvContent = [
        // CSV headers
        ['Name', 'Code', 'Address', 'City', 'State', 'Country', 'ZIP Code', 'Phone', 'Email', 'Status', 'Created At'].join(','),
        // CSV data
        ...filteredBranches.map(branch => [
          `"${branch.name}"`,
          `"${branch.code}"`,
          `"${branch.address}"`,
          `"${branch.city}"`,
          `"${branch.state}"`,
          `"${branch.country}"`,
          `"${branch.zipCode}"`,
          `"${branch.phone}"`,
          `"${branch.email}"`,
          `"${branch.status}"`,
          `"${new Date(branch.createdAt).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `branches-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showSuccess("Branches exported successfully");
    } catch (error) {
      showError("Failed to export branches");
    }
  };

  const getFormMode = () => {
    if (viewingBranch) return 'view';
    if (editingBranch) return 'edit';
    return 'create';
  };

  const getCurrentBranch = () => {
    return viewingBranch || editingBranch || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Branches
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your organization's branches and locations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center"
            disabled={isLoading || filteredBranches.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setShowForm(true)} 
            className="flex items-center"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      {!showForm && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search branches by name, code, city, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {(searchTerm || statusFilter !== "all") && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredBranches.length} of {branches.length} branches
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {viewingBranch ? "View Branch" : editingBranch ? "Edit Branch" : "Add New Branch"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BranchForm
              branch={getCurrentBranch()}
              onCancel={handleClose}
              onSuccess={handleSuccess}
              isLoading={isLoading}
              mode={getFormMode()}
            />
          </CardContent>
        </Card>
      ) : (
        <BranchList 
          branches={filteredBranches}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}