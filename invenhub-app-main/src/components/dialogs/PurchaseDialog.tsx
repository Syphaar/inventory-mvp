import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { purchases, useStore } from "@/lib/store";
import { toast } from "sonner";

export function PurchaseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const productList = useStore((state) => state.products);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    if (open) {
      const first = productList[0];
      setProductId(first?.id ?? "");
      setUnitCost(first?.cost ?? 0);
      setQuantity(1);
      setSupplier("");
    }
  }, [open, productList]);

  useEffect(() => {
    const product = productList.find((product) => product.id === productId);
    if (product) setUnitCost(product.cost);
  }, [productId, productList]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      purchases.create({ productId, quantity, unitCost, supplier });
      toast.success("Purchase recorded · stock increased");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New purchase / restock</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productList.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit cost ($)</Label>
              <Input
                type="number"
                min={0}
                value={unitCost}
                onChange={(event) => setUnitCost(Number(event.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Supplier</Label>
            <Input
              value={supplier}
              onChange={(event) => setSupplier(event.target.value)}
              placeholder="Supplier name"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Record purchase</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
