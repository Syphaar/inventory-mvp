import { useProducts, useSales } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/format";
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
import { useMemo } from "react";

export function DashboardPage() {
  const { data: products = [] } = useProducts();
  const { data: sales = [] } = useSales();

  const totalProducts = products.length;
  const stockValue = products.reduce((sum: number, product: any) => sum + product.stock * product.cost, 0);
  const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const lowStock = products.filter((product: any) => product.stock <= product.lowStockThreshold).length;

  const salesByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (let day = 13; day >= 0; day--) {
      const date = new Date(Date.now() - day * 86400000);
      const key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map.set(key, 0);
    }
    sales.forEach((sale: any) => {
      const key = new Date(sale.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + sale.total);
    });
    return Array.from(map, ([day, value]) => ({ day, value }));
  }, [sales]);

  const stockData = products.map((product: any) => ({
    name: product.name.length > 14 ? product.name.slice(0, 12) + "..." : product.name,
    stock: product.stock,
    low: product.stock <= product.lowStockThreshold,
  }));

  const stats = [
    {
      label: "Total products",
      value: formatNumber(totalProducts),
      icon: Package,
      color: "text-chart-1",
    },
    {
      label: "Stock value",
      value: formatCurrency(stockValue),
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      label: "Total sales",
      value: formatCurrency(totalSales),
      icon: ShoppingCart,
      color: "text-chart-2",
    },
    {
      label: "Low stock",
      value: formatNumber(lowStock),
      icon: AlertTriangle,
      color: "text-chart-5",
    },
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales · last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stock by product</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
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
                  {stockData.map((item: any, index: number) => (
                    <Cell key={index} fill={item.low ? "var(--chart-5)" : "var(--chart-2)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
                {sales.slice(0, 8).map((sale: any) => {
                  const product = products.find((p: any) => p.id === sale.productId);
                  return (
                    <tr key={sale.id} className="border-b last:border-0">
                      <td className="py-2.5">{formatDateTime(sale.date)}</td>
                      <td className="py-2.5">{product?.name ?? "\u2014"}</td>
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
