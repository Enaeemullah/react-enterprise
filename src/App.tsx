import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Contexts
import { ThemeProvider } from "./contexts/theme-context";
import { GlobalProvider } from "./contexts/global-context";
import { AuthProvider } from "./contexts/auth-context";
import { ProfileProvider } from "./contexts/profile-context";
import { InventoryProvider } from "./contexts/inventory-context";

// Layouts
import { AuthLayout } from "./components/auth/auth-layout";
import { DashboardLayout } from "./components/dashboard/dashboard-layout";

// Pages
import { LoginPage } from "./pages/auth/login";
import { SignupPage } from "./pages/auth/signup";
import { LogoutPage } from "./pages/auth/logout";
import { DashboardHomePage } from "./pages/dashboard/dashboard-home";
import { InventoryListPage } from "./pages/dashboard/inventory/inventory-list";
import { InventoryAddPage } from "./pages/dashboard/inventory/inventory-add";
import { InventoryEditPage } from "./pages/dashboard/inventory/inventory-edit";
import { InventoryDetailPage } from "./pages/dashboard/inventory/inventory-detail";
import { InventoryTransferPage } from "./pages/dashboard/inventory/inventory-transfer";
import { BranchListPage } from "./pages/dashboard/inventory/branches";
import { SupplierListPage } from "./pages/dashboard/inventory/suppliers";
import { ProfilePage } from "./pages/dashboard/profile";
import { SettingsPage } from "./pages/dashboard/settings";
import { POSPage } from "./pages/dashboard/pos";
import { RolesPage } from "./pages/dashboard/roles";
import { PermissionsPage } from "./pages/dashboard/permissions";
import { ModulesPage } from "./pages/dashboard/modules";
import { ActionsPage } from "./pages/dashboard/actions";
import { CustomersPage } from "./pages/dashboard/customers";
import { CustomerServicesPage } from "./pages/dashboard/customers/services";
import { CurrenciesPage } from "./pages/dashboard/currencies";
import { NotFoundPage } from "./pages/not-found";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalProvider>
          <ProfileProvider>
            <InventoryProvider>
              <Router>
                <Routes>
                  {/* Redirect root to signup */}
                  <Route path="/" element={<Navigate to="/auth/signup" replace />} />
                  
                  {/* Auth routes */}
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                    <Route path="logout" element={<LogoutPage />} />
                    <Route path="" element={<Navigate to="/auth/signup" replace />} />
                  </Route>
                  
                  {/* Dashboard routes */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="" element={<DashboardHomePage />} />
                    
                    {/* POS route */}
                    <Route path="pos" element={<POSPage />} />
                    
                    {/* Inventory routes */}
                    <Route path="inventory" element={<InventoryListPage />} />
                    <Route path="inventory/add" element={<InventoryAddPage />} />
                    <Route path="inventory/:id" element={<InventoryDetailPage />} />
                    <Route path="inventory/:id/edit" element={<InventoryEditPage />} />
                    <Route path="inventory/transfer" element={<InventoryTransferPage />} />
                    <Route path="inventory/branches" element={<BranchListPage />} />
                    <Route path="inventory/suppliers" element={<SupplierListPage />} />
                    
                    {/* Customer routes */}
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="customers/services" element={<CustomerServicesPage />} />
                    
                    {/* Currency routes */}
                    <Route path="currencies" element={<CurrenciesPage />} />
                    
                    {/* Security routes */}
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="permissions" element={<PermissionsPage />} />
                    <Route path="modules" element={<ModulesPage />} />
                    <Route path="actions" element={<ActionsPage />} />
                    
                    {/* Other routes */}
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    
                    {/* Services placeholder */}
                    <Route path="services" element={<div className="p-4">Services page (Coming soon)</div>} />
                    
                    {/* Reports placeholder */}
                    <Route path="reports" element={<div className="p-4">Reports page (Coming soon)</div>} />
                  </Route>
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
              <Toaster 
                position="top-right"
                expand={false}
                richColors
                closeButton
              />
            </InventoryProvider>
          </ProfileProvider>
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;