import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/auth-context";
import { useProfile } from "../../contexts/profile-context";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user } = useAuth();
  const { profile, updateProfile, isLoading } = useProfile();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      phoneNumber: profile?.phoneNumber || "",
      department: profile?.department || "",
      position: profile?.position || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Your Profile
      </h1>

      {successMessage && (
        <div className="bg-success-50 dark:bg-success-900/30 border border-success-300 dark:border-success-800 text-success-700 dark:text-success-400 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden mb-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <span className="text-4xl font-medium text-gray-500">
                  {user?.name?.[0]}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {user?.email}
            </p>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-4 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Role</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Department</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {profile?.department || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Position</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {profile?.position || "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Name"
                error={errors.name?.message}
                {...register("name")}
              />
              
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us about yourself"
                  {...register("bio")}
                />
                {errors.bio?.message && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.bio.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Location"
                  placeholder="City, Country"
                  error={errors.location?.message}
                  {...register("location")}
                />
                
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  error={errors.phoneNumber?.message}
                  {...register("phoneNumber")}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Department"
                  placeholder="e.g. Marketing"
                  error={errors.department?.message}
                  {...register("department")}
                />
                
                <Input
                  label="Position"
                  placeholder="e.g. Senior Manager"
                  error={errors.position?.message}
                  {...register("position")}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}