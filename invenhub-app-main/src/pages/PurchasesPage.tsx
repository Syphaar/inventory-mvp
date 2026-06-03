import { useState } from "react";
import { useStore, purchases as purchasesApi } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { PurchaseDialog } from "@/components/dialogs/PurchaseDialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { toast } from "sonner";

export function PurchasesPage() {
  const purchases = useStore((state) => state.purchases);
  const products = useStore((state) => state.products);
  const [open, setOpen] = useState(false);

  const total = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const units = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);

  const handleDelete = (id: string) => {
    if (confirm("Delete this purchase? Stock will be reduced accordingly.")) {
      purchasesApi.remove(id);
      toast.success("Purchase deleted · stock reduced");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Total spend</div>
            <div className="text-2xl font-semibold mt-1">{formatCurrency(total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Units purchased</div>
            <div className="text-2xl font-semibold mt-1">{units}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New purchase
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
                  <th className="px-4 py-3 font-medium">Supplier</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Unit cost</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((pu) => {
                  const product = products.find((product) => product.id === pu.productId);
                  return (
                    <tr key={pu.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3">{formatDateTime(pu.date)}</td>
                      <td className="px-4 py-3 font-medium">{product?.name ?? "—"}</td>
                      <td className="px-4 py-3">{pu.supplier}</td>
                      <td className="px-4 py-3 text-right">{pu.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(pu.unitCost)}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(pu.total)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(pu.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">
                      No purchases recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PurchaseDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
