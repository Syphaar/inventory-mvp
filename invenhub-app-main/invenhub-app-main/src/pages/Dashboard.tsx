/**
 * Dashboard Page
 *
 * Main dashboard providing inventory overview and analytics.
 * Displays key metrics and charts for inventory management.
 *
 * Features:
 * - Key metrics cards (total products, stock value, sales, low stock)
 * - Sales chart (last 14 days)
 * - Stock by product bar chart
 * - Recent transactions table
 *
 * Backend Integration:
 * - GET /api/products - Fetch all products
 * - GET /api/sales - Fetch all sales
 * - GET /api/sales/stats - Get sales statistics
 * - GET /api/purchases/stats - Get purchase statistics
 *
 * Connected Routes:
 * - Sidebar links to /products, /stock, /sales, /purchases
 * - Each metric can link to respective detail pages
 *
 * Data Flow:
 * 1. useEffect fetches products and sales on component mount
 * 2. Calculations compute metrics from data
 * 3. Charts and tables render with formatted data
 */

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/formatNumber";
import { formatDateTime } from "@/utils/formatDate";
import { Package, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { Product, Sale, Purchase } from "@/types";

/**
 * Stat Card Configuration
 * Used to build metric cards in header
 */
interface StatCardConfig {
  label: string;
  value: string;
  icon: typeof Package;
  color: string;
}

/**
 * Dashboard Page Component
 *
 * Renders all dashboard sections:
 * - 4 KPI cards
 * - 2 charts (sales trend and stock levels)
 * - Recent transactions table
 */
export default function Dashboard() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load Dashboard Data
   *
   * Fetches products, sales, and purchases from backend APIs
   * Note: Currently uses mock data; replace with API calls when backend is ready
   *
   * API Calls:
   * - GET /api/products
   * - GET /api/sales
   * - GET /api/purchases
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // TODO: Replace with actual API calls
        // const [productsData, salesData, purchasesData] = await Promise.all([
        //   productApi.getAll(),
        //   saleApi.getAll(),
        //   purchaseApi.getAll(),
        // ]);

        // Mock data (remove when backend is ready)
        setProducts([]);
        setSales([]);
        setPurchases([]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Calculate Key Metrics
   *
   * Computes dashboard statistics from products and sales
   * Memoized to prevent unnecessary recalculations
   */
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const stockValue = products.reduce((sum, p) => sum + (p.stock * p.cost || 0), 0);
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold).length;

    return { totalProducts, stockValue, totalSales, lowStock };
  }, [products, sales]);

  /**
   * Calculate Sales by Day
   *
   * Groups sales by date over last 14 days
   * Used for line chart visualization
   *
   * Returns array of { day: string, value: number }
   */
  const salesByDay = useMemo(() => {
    const map = new Map<string, number>();

    // Initialize 14 days with 0 value
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map.set(key, 0);
    }

    // Add sales values for each date
    sales.forEach((s) => {
      const key = new Date(s.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (map.has(key)) {
        map.set(key, (map.get(key) ?? 0) + s.total);
      }
    });

    return Array.from(map, ([day, value]) => ({ day, value }));
  }, [sales]);

  /**
   * Prepare Stock Chart Data
   *
   * Transforms products into chart-friendly format
   * Shows stock levels for each product
   * Low stock items colored differently
   */
  const stockData = useMemo(() => {
    return products.map((p) => ({
      name: p.name.length > 14 ? p.name.slice(0, 12) + "…" : p.name,
      stock: p.stock,
      isLow: p.stock <= p.lowStockThreshold,
    }));
  }, [products]);

  /**
   * Stat Cards Configuration
   *
   * Array of metric cards shown in header
   * Each includes label, formatted value, icon, and color
   */
  const stats: StatCardConfig[] = [
    {
      label: "Total products",
      value: formatNumber(metrics.totalProducts),
      icon: Package,
      color: "text-chart-1",
    },
    {
      label: "Stock value",
      value: formatCurrency(metrics.stockValue),
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      label: "Total sales",
      value: formatCurrency(metrics.totalSales),
      icon: ShoppingCart,
      color: "text-chart-2",
    },
    {
      label: "Low stock",
      value: formatNumber(metrics.lowStock),
      icon: AlertTriangle,
      color: "text-chart-5",
    },
  ];

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-semibold mt-1">{stat.value}</div>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Sales Trend Chart - Last 14 Days */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales · last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {salesByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                    formatter={(value) =>
                      typeof value === "number" ? formatCurrency(value) : value
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock by Product Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stock by product</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {stockData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                    {stockData.map((item, index) => (
                      <Cell key={index} fill={item.isLow ? "var(--chart-5)" : "var(--chart-2)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No product data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium text-right">Qty</th>
                  <th className="py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 8).map((sale) => {
                  const product = products.find((p) => p.id === sale.productId);
                  return (
                    <tr key={sale.id} className="border-b last:border-0">
                      <td className="py-2.5">{formatDateTime(sale.date)}</td>
                      <td className="py-2.5">{product?.name ?? "—"}</td>
                      <td className="py-2.5">{sale.customer}</td>
                      <td className="py-2.5 text-right">{sale.quantity}</td>
                      <td className="py-2.5 text-right font-medium">
                        {formatCurrency(sale.total)}
                      </td>
                    </tr>
                  );
                })}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No sales yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
