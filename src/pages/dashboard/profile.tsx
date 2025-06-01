import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/auth-context";
import { useProfile } from "../../contexts/profile-context";
import { useTranslation } from "react-i18next";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, changePassword } = useAuth();
  const { profile, updateProfile, isLoading } = useProfile();
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { t } = useTranslation();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
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

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      setSuccessMessage(t("profile.updateSuccess"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setPasswordError("");
      await changePassword(data.currentPassword, data.newPassword);
      setSuccessMessage(t("profile.passwordChangeSuccess"));
      resetPassword();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setPasswordError(t("profile.passwordChangeError"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("profile.title")}
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
                  alt={`${user.firstName}'s avatar`}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <span className="text-4xl font-medium text-gray-500">
                  {user?.firstName?.[0]}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.firstName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {user?.email}
            </p>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-4 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">{t("profile.role")}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">{t("profile.department")}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {profile?.department || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t("profile.position")}</span>
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
            <CardTitle>{t("profile.editProfile")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                label={t("profile.name")}
                error={profileErrors.name?.message}
                {...registerProfile("name")}
              />
              
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t("profile.bio")}
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t("profile.bioPlaceholder")}
                  {...registerProfile("bio")}
                />
                {profileErrors.bio?.message && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {profileErrors.bio.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t("profile.location")}
                  placeholder={t("profile.locationPlaceholder")}
                  error={profileErrors.location?.message}
                  {...registerProfile("location")}
                />
                
                <Input
                  label={t("profile.phoneNumber")}
                  placeholder={t("profile.phonePlaceholder")}
                  error={profileErrors.phoneNumber?.message}
                  {...registerProfile("phoneNumber")}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t("profile.department")}
                  placeholder={t("profile.departmentPlaceholder")}
                  error={profileErrors.department?.message}
                  {...registerProfile("department")}
                />
                
                <Input
                  label={t("profile.position")}
                  placeholder={t("profile.positionPlaceholder")}
                  error={profileErrors.position?.message}
                  {...registerProfile("position")}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>
                  {t("common.save")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{t("profile.changePassword")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              {passwordError && (
                <div className="bg-error-50 dark:bg-error-900/30 border border-error-300 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-md">
                  {passwordError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  type="password"
                  label={t("profile.currentPassword")}
                  error={passwordErrors.currentPassword?.message}
                  {...registerPassword("currentPassword")}
                />
                
                <Input
                  type="password"
                  label={t("profile.newPassword")}
                  error={passwordErrors.newPassword?.message}
                  {...registerPassword("newPassword")}
                />
                
                <Input
                  type="password"
                  label={t("profile.confirmPassword")}
                  error={passwordErrors.confirmPassword?.message}
                  {...registerPassword("confirmPassword")}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">
                  {t("profile.updatePassword")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}