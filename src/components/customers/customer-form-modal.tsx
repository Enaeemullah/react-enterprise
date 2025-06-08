import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, User, Building } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { customerService, CreateCustomerDTO } from "../../services/customer.service";
import { useGlobal } from "../../contexts/global-context";
import { useNotifications } from "../../contexts/notification-context";

const customerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  customerType: z.enum(["individual", "business"]).optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: any) => void;
  title?: string;
}

export function CustomerFormModal({ isOpen, onClose, onSuccess, title = "Add New Customer" }: CustomerFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerType, setCustomerType] = useState<"individual" | "business">("individual");
  const { showSuccess, showError } = useGlobal();
  const { notifyCreate } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerType: "individual",
      country: "United States",
    },
  });

  const watchedCustomerType = watch("customerType");

  React.useEffect(() => {
    if (watchedCustomerType) {
      setCustomerType(watchedCustomerType);
    }
  }, [watchedCustomerType]);

  const handleFormSubmit = async (data: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      
      const customerData: CreateCustomerDTO = {
        ...data,
        status: "active",
      };

      const newCustomer = await customerService.createCustomer(customerData);
      
      showSuccess("Customer created successfully");
      notifyCreate("Customer", `${data.firstName} ${data.lastName}`, true);
      
      reset();
      onSuccess(newCustomer);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create customer";
      showError(errorMessage);
      notifyCreate("Customer", `${data.firstName} ${data.lastName}`, false);
      console.error("Customer creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Customer Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Customer Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="individual"
                  {...register("customerType")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <User className="h-4 w-4 ml-2 mr-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Individual</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="business"
                  {...register("customerType")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <Building className="h-4 w-4 ml-2 mr-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Business</span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              disabled={isSubmitting}
              {...register("firstName")}
            />
            
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              disabled={isSubmitting}
              {...register("lastName")}
            />
          </div>

          {/* Company Name for Business */}
          {customerType === "business" && (
            <Input
              label="Company Name"
              placeholder="Acme Corporation"
              error={errors.companyName?.message}
              disabled={isSubmitting}
              {...register("companyName")}
            />
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register("email")}
            />
            
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
              disabled={isSubmitting}
              {...register("phone")}
            />
          </div>

          {/* Address Information */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              rows={2}
              placeholder="123 Main Street"
              disabled={isSubmitting}
              {...register("address")}
            />
            {errors.address?.message && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="City"
              placeholder="New York"
              error={errors.city?.message}
              disabled={isSubmitting}
              {...register("city")}
            />
            
            <Input
              label="State"
              placeholder="NY"
              error={errors.state?.message}
              disabled={isSubmitting}
              {...register("state")}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="ZIP Code"
              placeholder="10001"
              error={errors.zipCode?.message}
              disabled={isSubmitting}
              {...register("zipCode")}
            />
            
            <Input
              label="Country"
              placeholder="United States"
              error={errors.country?.message}
              disabled={isSubmitting}
              {...register("country")}
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              rows={3}
              placeholder="Additional notes about the customer"
              disabled={isSubmitting}
              {...register("notes")}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}