import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/auth-context";
import { useGlobal } from "../../contexts/global-context";
import { Building, Upload, X } from "lucide-react";
import { userService } from "../../services/user.service";

const organizationSchema = z.object({
  orga_code: z.string().min(2, "Organization code must be at least 2 characters"),
  orga_desc: z.string().min(10, "Organization description must be at least 10 characters"),
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional().or(z.literal("")),
  address: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  logo: z.string().url("Please enter a valid logo URL").optional().or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export function SettingsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useGlobal();
  const [orgSuccessMessage, setOrgSuccessMessage] = useState("");
  const [isUpdatingOrg, setIsUpdatingOrg] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);

  // Organization form
  const {
    register: registerOrg,
    handleSubmit: handleOrgSubmit,
    formState: { errors: orgErrors },
    watch: watchOrg,
    setValue: setOrgValue,
    reset: resetOrgForm,
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      orga_code: "",
      orga_desc: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      logo: "",
    },
  });

  const logoUrl = watchOrg("logo");

  // Load organization data on component mount
  useEffect(() => {
    const loadOrganizationData = async () => {
      try {
        setIsLoadingOrg(true);
        console.log('Loading organization data...');
        
        const orgData = await userService.getOrganization();
        console.log('Organization data loaded:', orgData);
        
        // Reset form with loaded data
        resetOrgForm({
          orga_code: orgData.orga_code || "",
          orga_desc: orgData.orga_desc || "",
          name: orgData.name || "",
          email: orgData.email || "",
          phone: orgData.phone || "",
          address: orgData.address || "",
          website: orgData.website || "",
          logo: orgData.logo || "",
        });
        
        console.log('Form reset with organization data');
      } catch (error) {
        console.error('Failed to load organization data:', error);
        
        // If organization doesn't exist, use user's org_code as default
        if (user?.orga_code) {
          resetOrgForm({
            orga_code: user.orga_code,
            orga_desc: "",
            name: "",
            email: "",
            phone: "",
            address: "",
            website: "",
            logo: "",
          });
        }
        
        showError("Failed to load organization data. You can still update the information below.");
      } finally {
        setIsLoadingOrg(false);
      }
    };

    loadOrganizationData();
  }, [user?.orga_code, resetOrgForm, showError]);

  const onOrganizationSubmit = async (data: OrganizationFormValues) => {
    try {
      setIsUpdatingOrg(true);
      console.log('Submitting organization update:', data);
      
      // Call the organization update service
      const updatedOrg = await userService.updateOrganization(data);
      console.log('Organization updated successfully:', updatedOrg);
      
      setOrgSuccessMessage("Organization details updated successfully!");
      showSuccess("Organization details updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setOrgSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating organization:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update organization details";
      showError(errorMessage);
    } finally {
      setIsUpdatingOrg(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUpdatingOrg(true);
        console.log('Uploading logo file:', file.name);
        
        // Upload the file using the service
        const uploadResult = await userService.uploadOrganizationLogo(file);
        console.log('Logo uploaded successfully:', uploadResult);
        
        // Update the form with the new logo URL
        setOrgValue("logo", uploadResult.url);
        showSuccess("Logo uploaded successfully! Remember to save your changes.");
      } catch (error) {
        console.error('Failed to upload logo:', error);
        showError("Failed to upload logo. Please try again.");
      } finally {
        setIsUpdatingOrg(false);
      }
    }
  };

  const removeLogo = () => {
    setOrgValue("logo", "");
  };

  if (isLoadingOrg) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading organization details...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Building className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Organization Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your organization details and branding
          </p>
        </div>
      </div>

      {orgSuccessMessage && (
        <div className="bg-success-50 dark:bg-success-900/30 border border-success-300 dark:border-success-800 text-success-700 dark:text-success-400 px-4 py-3 rounded-md">
          {orgSuccessMessage}
        </div>
      )}

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOrgSubmit(onOrganizationSubmit)} className="space-y-6">
            {/* Logo Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Logo
              </label>
              <div className="flex items-start space-x-4">
                {/* Logo Preview */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
                    {logoUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={logoUrl}
                          alt="Organization Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center">
                          <Building className="h-8 w-8 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Upload Controls */}
                <div className="flex-1">
                  <div className="flex flex-col space-y-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={isUpdatingOrg}
                      />
                      <div className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                        <Upload className="h-4 w-4 mr-2" />
                        {isUpdatingOrg ? "Uploading..." : "Upload Logo"}
                      </div>
                    </label>
                    <Input
                      label="Or enter logo URL"
                      placeholder="https://example.com/logo.png"
                      error={orgErrors.logo?.message}
                      disabled={isUpdatingOrg}
                      {...registerOrg("logo")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Organization Code"
                placeholder="Enter organization code"
                error={orgErrors.orga_code?.message}
                disabled={isUpdatingOrg}
                {...registerOrg("orga_code")}
              />
              
              <Input
                label="Organization Name"
                placeholder="Enter organization name"
                error={orgErrors.name?.message}
                disabled={isUpdatingOrg}
                {...registerOrg("name")}
              />
            </div>

            <div>
              <label
                htmlFor="orga_desc"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Organization Description
              </label>
              <textarea
                id="orga_desc"
                className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Describe your organization"
                disabled={isUpdatingOrg}
                {...registerOrg("orga_desc")}
              />
              {orgErrors.orga_desc?.message && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {orgErrors.orga_desc.message}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                placeholder="organization@example.com"
                error={orgErrors.email?.message}
                disabled={isUpdatingOrg}
                {...registerOrg("email")}
              />
              
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                error={orgErrors.phone?.message}
                disabled={isUpdatingOrg}
                {...registerOrg("phone")}
              />
            </div>

            <Input
              label="Website"
              type="url"
              placeholder="https://www.example.com"
              error={orgErrors.website?.message}
              disabled={isUpdatingOrg}
              {...registerOrg("website")}
            />

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                className="block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Enter organization address"
                disabled={isUpdatingOrg}
                {...registerOrg("address")}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isUpdatingOrg} disabled={isUpdatingOrg}>
                {isUpdatingOrg ? "Updating..." : "Update Organization"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}