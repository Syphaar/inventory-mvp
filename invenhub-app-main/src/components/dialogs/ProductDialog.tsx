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
import { useCreateProduct, useUpdateProduct } from "@/lib/store";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product?: any;
};

const empty = {
  sku: "",
  name: "",
  category: "",
  price: 0,
  cost: 0,
  stock: 0,
  lowStockThreshold: 5,
};

export function ProductDialog({ open, onOpenChange, product }: Props) {
  const [form, setForm] = useState(empty);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (open) {
      setForm(product ? { ...product } : empty);
    }
  }, [open, product]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
    };

    if (!payload.name || !payload.sku || !payload.category) {
      toast.error("Name, SKU, and category are required");
      return;
    }

    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, data: payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription className="sr-only">
            Product details form.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(event) => setForm({ ...form, sku: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price ($)</Label>
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cost ($)</Label>
              <Input
                type="number"
                min={0}
                value={form.cost}
                onChange={(event) => setForm({ ...form, cost: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Low stock threshold</Label>
              <Input
                type="number"
                min={0}
                value={form.lowStockThreshold}
                onChange={(event) =>
                  setForm({ ...form, lowStockThreshold: Number(event.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
