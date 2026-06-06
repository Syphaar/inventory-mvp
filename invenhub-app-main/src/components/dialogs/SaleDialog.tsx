import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useProducts, useCreateSale } from "@/lib/store";
import { toast } from "sonner";

export function SaleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { data: productList = [] } = useProducts();
  const createSale = useCreateSale();
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customer, setCustomer] = useState("Walk-in");

  useEffect(() => {
    if (open) {
      const first = productList[0];
      setProductId(first?.id ?? "");
      setUnitPrice(first?.price ?? 0);
      setQuantity(1);
      setCustomer("Walk-in");
    }
  }, [open, productList]);

  useEffect(() => {
    const product = productList.find((p: any) => p.id === productId);
    if (product) setUnitPrice(product.price);
  }, [productId, productList]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productId) {
      toast.error("Select a product before recording a sale");
      return;
    }

    try {
      await createSale.mutateAsync({
        productId,
        quantity,
        unitPrice,
        customer: customer.trim() || "Walk-in",
      });
      toast.success("Sale recorded · stock updated");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || (err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New sale</DialogTitle>
          <DialogDescription className="sr-only">
            Sale details form.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productList.map((product: any) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} · {product.stock} in stock
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
              <Label>Unit price ($)</Label>
              <Input
                type="number"
                min={0}
                value={unitPrice}
                onChange={(event) => setUnitPrice(Number(event.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Customer</Label>
            <Input
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              placeholder="Walk-in"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Record sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
