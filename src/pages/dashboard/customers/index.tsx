import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, User, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CustomerFormModal } from "../../../components/customers/customer-form-modal";
import { CustomerServicesForm } from "../../../components/customers/customer-services-form";
import { customerService, Customer } from "../../../services/customer.service";
import { useGlobal } from "../../../contexts/global-context";
import { useNotifications } from "../../../contexts/notification-context";
import { formatDate } from "../../../lib/utils";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { showSuccess, showError } = useGlobal();
  const { notifyDelete } = useNotifications();

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers when search term or filters change
  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, typeFilter, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      showError("Failed to fetch customers");
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.companyName && customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(customer => customer.customerType === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setShowAddForm(false);
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      await customerService.deleteCustomer(customer.id);
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      showSuccess("Customer deleted successfully");
      notifyDelete("Customer", `${customer.firstName} ${customer.lastName}`, true);
    } catch (error) {
      showError("Failed to delete customer");
      notifyDelete("Customer", `${customer.firstName} ${customer.lastName}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.customerType === "business" && customer.companyName) {
      return `${customer.companyName}`;
    }
    return `${customer.firstName} ${customer.lastName}`;
  };

  if (viewingCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setViewingCustomer(null)}
              className="mb-4"
            >
              ← Back to Customers
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getCustomerDisplayName(viewingCustomer)}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Customer details and services
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                {viewingCustomer.customerType === "business" ? (
                  <Building className="h-5 w-5 mr-2" />
                ) : (
                  <User className="h-5 w-5 mr-2" />
                )}
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-white">
                  {viewingCustomer.firstName} {viewingCustomer.lastName}
                </p>
              </div>
              
              {viewingCustomer.companyName && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</label>
                  <p className="text-gray-900 dark:text-white">{viewingCustomer.companyName}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white">{viewingCustomer.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <p className="text-gray-900 dark:text-white">{viewingCustomer.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                <p className="text-gray-900 dark:text-white capitalize">{viewingCustomer.customerType}</p>
              </div>
              
              {viewingCustomer.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                  <p className="text-gray-900 dark:text-white">
                    {viewingCustomer.address}
                    {viewingCustomer.city && (
                      <>
                        <br />
                        {viewingCustomer.city}, {viewingCustomer.state} {viewingCustomer.zipCode}
                      </>
                    )}
                    {viewingCustomer.country && (
                      <>
                        <br />
                        {viewingCustomer.country}
                      </>
                    )}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(new Date(viewingCustomer.createdAt))}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Services */}
          <div className="lg:col-span-2">
            <CustomerServicesForm
              customerId={viewingCustomer.id}
              customerName={getCustomerDisplayName(viewingCustomer)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your customer database and their services
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search customers by name, email, phone, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-40">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="sm:w-40">
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
          {(searchTerm || typeFilter !== "all" || statusFilter !== "all") && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading customers...</p>
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            {customer.customerType === "business" ? (
                              <Building className="h-5 w-5 text-gray-400" />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.firstName} {customer.lastName}
                            </div>
                            {customer.companyName && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {customer.companyName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.customerType === "business"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {customer.customerType
                            ? customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)
                            : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(new Date(customer.createdAt))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            title="View customer details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer)}
                            className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                            title="Delete customer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <User className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          No customers found
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Click 'Add Customer' to create your first customer"
                          }
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

      {/* Add Customer Modal */}
      <CustomerFormModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleAddCustomer}
      />
    </div>
  );
}