import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Package, Users, Home, ShoppingCart, BarChart3, 
  Layers, ChevronRight, X, Building2, Shield, Store,
  Boxes, Activity,
  Flower2,
  UserCog
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/auth-context";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { 
    name: "Inventory", 
    icon: Package,
    children: [
      { name: "All Items", href: "/dashboard/inventory" },
      { name: "Add Item", href: "/dashboard/inventory/add" },
      { name: "Bulk Upload", href: "/dashboard/inventory/bulk-upload"},
      { name: "Transfer", href: "/dashboard/inventory/transfer"},
      { name: "Branches", href: "/dashboard/inventory/branches"},
      { name: "Brands", href: "/dashboard/inventory/brands"},
      { name: "Suppliers", href: "/dashboard/inventory/suppliers" },
      { name: "Categories", href: "/dashboard/inventory/categories"},
    ],
  },
  { name: "Point of Sale", href: "/dashboard/pos", icon: Store },
  { name: "Services", href: "/dashboard/services", icon: ShoppingCart },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { 
    name: "Security", 
    icon: Shield,
    children: [
      { name: "Roles", href: "/dashboard/roles" },
      { name: "Permissions", href: "/dashboard/permissions" },
      { name: "Modules", href: "/dashboard/modules" },
      { name: "Actions", href: "/dashboard/actions" },
    ],
  },
  {
    name: "User Management",
    icon: UserCog,
    children: [
      { name: "All Users", href: "/dashboard/users" },
      { name: "Add User", href: "/dashboard/users/add" },
      { name: "User Groups", href: "/dashboard/users/groups" },
    ],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 w-64 shadow-lg">
      <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
            <Flower2 className="h-8 w-8 mr-2" />
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-4 py-4">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md",
                      isActive(item.href || "")
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSubmenu === item.name ? "rotate-90" : ""
                      )}
                    />
                  </button>
                  {openSubmenu === item.name && (
                    <div className="mt-1 pl-10 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md",
                            isActive(child.href)
                              ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                              : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                          )}
                          onClick={onClose}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  )}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <span className="font-medium text-gray-700">{user?.firstName?.[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.firstName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile close button */}
      {open && (
        <button
          className="fixed top-4 right-4 z-40 lg:hidden rounded-full p-2 bg-white dark:bg-gray-800 shadow-lg"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
      )}
      
      <SidebarContent />
    </>
  );
}