import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "user",
      department: user?.department || "",
      position: user?.position || "",
      status: user?.status || "active",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError((err as Error).message || "Failed to save user");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-error-50 dark:bg-error-900/30 border border-error-300 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        
        <Input
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            {...register("role")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.role.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            {...register("status")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status?.message && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Department"
          placeholder="IT Department"
          error={errors.department?.message}
          {...register("department")}
        />
        
        <Input
          label="Position"
          placeholder="Software Engineer"
          error={errors.position?.message}
          {...register("position")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        
        <Input
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {user ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}