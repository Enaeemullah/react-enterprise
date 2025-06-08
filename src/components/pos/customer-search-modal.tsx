import React, { useState, useEffect } from "react";
import { Search, X, UserPlus, User, Building } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CustomerFormModal } from "../customers/customer-form-modal";
import { customerService, Customer } from "../../services/customer.service";
import { useGlobal } from "../../contexts/global-context";

interface CustomerSearchModalProps {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  onAddNew: () => void;
}

export function CustomerSearchModal({ onClose, onSelect, onAddNew }: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showError } = useGlobal();

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.companyName && customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      showError("Failed to fetch customers");
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setFilteredCustomers(prev => [newCustomer, ...prev]);
    setShowAddForm(false);
    onSelect(newCustomer);
  };

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.customerType === "business" && customer.companyName) {
      return `${customer.companyName} (${customer.firstName} ${customer.lastName})`;
    }
    return `${customer.firstName} ${customer.lastName}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Select Customer
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, email, phone, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading customers...</p>
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                    onClick={() => onSelect(customer)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {customer.customerType === "business" ? (
                          <Building className="h-4 w-4 text-gray-400" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getCustomerDisplayName(customer)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No customers found" : "No customers available"}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {searchTerm ? "Try adjusting your search" : "Add your first customer below"}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Add Customer Form Modal */}
      <CustomerFormModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleAddNewCustomer}
        title="Add New Customer"
      />
    </>
  );
}