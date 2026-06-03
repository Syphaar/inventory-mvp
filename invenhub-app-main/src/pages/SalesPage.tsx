import { useState, useMemo } from "react";
import { useStore, sales as salesApi } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { SaleDialog } from "@/components/dialogs/SaleDialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function SalesPage() {
  const sales = useStore((s) => s.sales);
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);

  const total = sales.reduce((s, x) => s + x.total, 0);
  const units = sales.reduce((s, x) => s + x.quantity, 0);

  const trend = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map.set(key, 0);
    }
    sales.forEach((s) => {
      const key = new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + s.total);
    });
    return Array.from(map, ([day, value]) => ({ day, value }));
  }, [sales]);

  const handleDelete = (id: string) => {
    if (confirm("Delete this sale? Stock will be restored.")) {
      salesApi.remove(id);
      toast.success("Sale deleted · stock restored");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Total revenue</div>
            <div className="text-2xl font-semibold mt-1">{formatCurrency(total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Units sold</div>
            <div className="text-2xl font-semibold mt-1">{units}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue trend</CardTitle>
        </CardHeader>
        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                fill="url(#rev)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New sale
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => {
                  const p = products.find((p) => p.id === s.productId);
                  return (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3">{formatDateTime(s.date)}</td>
                      <td className="px-4 py-3 font-medium">{p?.name ?? "—"}</td>
                      <td className="px-4 py-3">{s.customer}</td>
                      <td className="px-4 py-3 text-right">{s.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(s.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(s.total)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">
                      No sales recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SaleDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
