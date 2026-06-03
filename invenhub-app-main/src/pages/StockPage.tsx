import { useStore, products as productsApi } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function StockPage() {
  const products = useStore((s) => s.products);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const setLevel = (id: string) => {
    const val = Number(edits[id]);
    if (Number.isNaN(val) || val < 0) {
      toast.error("Enter a valid stock value");
      return;
    }
    productsApi.setStock(id, val);
    toast.success("Stock updated");
    setEdits((e) => {
      const c = { ...e };
      delete c[id];
      return c;
    });
  };

  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);

  return (
    <div className="space-y-4">
      {lowStock.length > 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="text-sm">
              <span className="font-semibold">{lowStock.length}</span> product
              {lowStock.length > 1 ? "s" : ""} below low-stock threshold.
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium text-right">Threshold</th>
                  <th className="px-4 py-3 font-medium text-right">Current</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Adjust</th>
                  <th className="px-4 py-3 font-medium">Set level</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const low = p.stock <= p.lowStockThreshold;
                  return (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {p.lowStockThreshold}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{p.stock}</td>
                      <td className="px-4 py-3">
                        {low ? (
                          <Badge variant="destructive">Low</Badge>
                        ) : (
                          <Badge variant="secondary">OK</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => productsApi.adjustStock(p.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => productsApi.adjustStock(p.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min={0}
                            value={edits[p.id] ?? ""}
                            placeholder={String(p.stock)}
                            onChange={(e) => setEdits({ ...edits, [p.id]: e.target.value })}
                            className="w-20 h-8"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLevel(p.id)}
                            disabled={edits[p.id] === undefined}
                          >
                            Save
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
