/**
 * Main Layout Component
 *
 * Wraps all protected (authenticated) pages with navigation sidebar, header, and footer.
 * Provides consistent layout structure for the entire application.
 *
 * Structure:
 * - Sidebar (left): Navigation menu with product, stock, sales, purchases, dashboard
 * - Content Area (right): Page content with responsive layout
 * - Mobile Toggle: Hamburger menu for mobile navigation
 *
 * Features:
 * - Responsive design (collapses sidebar on mobile)
 * - Active route highlighting
 * - User profile section with logout button
 * - Logo and branding
 *
 * Connected Backend Routes:
 * - All child routes connect to their respective backend resources
 * - User info from AuthContext (POST /api/auth/login)
 *
 * Usage:
 * <Layout>
 *   <Dashboard />
 * </Layout>
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  TruckIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Navigation item configuration
 * Used to build sidebar navigation menu
 */
interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
}

// Navigation items
const NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/stock", label: "Stock", icon: Boxes },
  { path: "/sales", label: "Sales", icon: ShoppingCart },
  { path: "/purchases", label: "Purchases", icon: TruckIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 *
 * Main layout wrapper for all authenticated pages
 * Provides sidebar navigation and user menu
 *
 * @param children - Page content to display in main area
 */
export default function Layout({ children }: LayoutProps) {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hooks
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Handle Logout
   * Clears auth state and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Navigate to Route
   * Closes sidebar on mobile after navigation
   */
  const navigateTo = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo / Branding */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
            IM
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Inventory</div>
            <div className="text-xs opacity-75">MVP</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar/50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="px-2 py-1 text-sm">
            <div className="font-medium">{user?.name || "User"}</div>
            <div className="text-xs opacity-75">{user?.email}</div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-sm"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header / Top Bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 lg:hidden">
          <div className="text-sm font-semibold">Inventory MVP</div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile overlay - click to close sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
