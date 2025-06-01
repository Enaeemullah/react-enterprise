import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { actionService } from "../../services/action.service";
import { useGlobal } from "../../contexts/global-context";
import type { Action } from "../../pages/dashboard/actions";

const actionSchema = z.object({
  name: z.string().min(2, "Action name must be at least 2 characters"),
  description: z.string().min(10, "Action description must be at least 10 characters"),
  module: z.string().min(2, "Module name must be at least 2 characters"),
  permissions: z.object({
    create: z.boolean(),
    read: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
  }),
});

type ActionFormValues = z.infer<typeof actionSchema>;

interface ActionFormProps {
  action?: Action | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActionForm({ action, onClose, onSuccess }: ActionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, showSuccess } = useGlobal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      name: action?.name || "",
      description: action?.description || "",
      module: action?.module || "",
      permissions: {
        create: action?.permissions?.create || false,
        read: action?.permissions?.read || false,
        update: action?.permissions?.update || false,
        delete: action?.permissions?.delete || false,
      },
    },
  });

  const onSubmit = async (data: ActionFormValues) => {
    setIsLoading(true);

    try {
      if (action) {
        await actionService.updateAction(action.id, data);
        showSuccess("Action updated successfully");
      } else {
        await actionService.createAction(data);
        showSuccess("Action created successfully");
      }
      onSuccess();
    } catch (err) {
      setError("Failed to save action. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Action Name"
        placeholder="Enter action name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Module"
        placeholder="Enter module name"
        error={errors.module?.message}
        {...register("module")}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Describe what this action allows"
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Permissions
        </label>
        <div className="space-y-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-primary-600 rounded border-gray-300 dark:border-gray-600"
              {...register("permissions.create")}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Create</span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-primary-600 rounded border-gray-300 dark:border-gray-600"
              {...register("permissions.read")}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Read</span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-primary-600 rounded border-gray-300 dark:border-gray-600"
              {...register("permissions.update")}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Update</span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-primary-600 rounded border-gray-300 dark:border-gray-600"
              {...register("permissions.delete")}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Delete</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {action ? "Update Action" : "Create Action"}
        </Button>
      </div>
    </form>
  );
}