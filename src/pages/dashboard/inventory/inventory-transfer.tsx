import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, Truck, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { InventoryTransferForm } from "../../../components/inventory/inventory-transfer-form";
import { transferService, Transfer } from "../../../services/transfer.service";
import { useGlobal } from "../../../contexts/global-context";
import { formatDate } from "../../../lib/utils";

export function InventoryTransferPage() {
  const [showForm, setShowForm] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useGlobal();

  // Fetch transfers on component mount
  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      const data = await transferService.getTransfers();
      setTransfers(data);
    } catch (error) {
      showError("Failed to fetch transfers");
      console.error("Error fetching transfers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchTransfers(); // Refresh the list
  };

  const getStatusIcon = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'cancelled':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Transfers
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transfer Inventory
          </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTransferForm
              onClose={() => setShowForm(false)}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Transfers
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Transfer stock between branches instantly
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center"
          disabled={isLoading}
        >
          <Package className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </div>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Item & Transfer Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    From → To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading transfers...</p>
                    </td>
                  </tr>
                ) : transfers.length > 0 ? (
                  transfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transfer.item?.name || 'Unknown Item'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {transfer.item?.sku || 'N/A'}
                          </div>
                          {transfer.notes && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Note: {transfer.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {transfer.sourceBranch?.name || 'Unknown Branch'}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            ↓
                          </div>
                          <div className="text-gray-900 dark:text-white">
                            {transfer.destinationBranch?.name || 'Unknown Branch'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transfer.quantity} units
                        </div>
                        {transfer.item?.price && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Value: ${(transfer.quantity * transfer.item.price).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(transfer.status)}
                          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transfer.status)}`}>
                            {transfer.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(new Date(transfer.completedAt || transfer.createdAt))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          No transfers found
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Click "New Transfer" to transfer inventory between branches
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}