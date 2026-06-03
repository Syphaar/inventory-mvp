import { useSyncExternalStore } from "react";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
};

export type Sale = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  date: string;
};

export type Purchase = {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
  supplier: string;
  date: string;
};

export type User = { id: string; name: string; email: string };

type State = {
  user: User | null;
  token: string | null;
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
};

const STORAGE_KEY = "inventory_mvp_pro_state_v1";

const seedProducts: Product[] = [
  {
    id: "p1",
    sku: "ELC-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 129,
    cost: 65,
    stock: 48,
    lowStockThreshold: 10,
  },
  {
    id: "p2",
    sku: "ELC-002",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 159,
    cost: 80,
    stock: 7,
    lowStockThreshold: 10,
  },
  {
    id: "p3",
    sku: "ELC-003",
    name: "4K Webcam",
    category: "Electronics",
    price: 89,
    cost: 40,
    stock: 23,
    lowStockThreshold: 8,
  },
  {
    id: "p4",
    sku: "OFC-101",
    name: "Standing Desk",
    category: "Office",
    price: 449,
    cost: 230,
    stock: 12,
    lowStockThreshold: 5,
  },
  {
    id: "p5",
    sku: "OFC-102",
    name: "Ergonomic Chair",
    category: "Office",
    price: 329,
    cost: 180,
    stock: 4,
    lowStockThreshold: 6,
  },
  {
    id: "p6",
    sku: "ACC-201",
    name: "USB-C Hub",
    category: "Accessories",
    price: 49,
    cost: 18,
    stock: 86,
    lowStockThreshold: 20,
  },
  {
    id: "p7",
    sku: "ACC-202",
    name: "Laptop Stand",
    category: "Accessories",
    price: 39,
    cost: 14,
    stock: 31,
    lowStockThreshold: 15,
  },
  {
    id: "p8",
    sku: "ELC-004",
    name: "Noise Cancelling Earbuds",
    category: "Electronics",
    price: 199,
    cost: 95,
    stock: 19,
    lowStockThreshold: 8,
  },
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

const seedSales: Sale[] = [
  {
    id: "s1",
    productId: "p1",
    quantity: 2,
    unitPrice: 129,
    total: 258,
    customer: "Acme Corp",
    date: daysAgo(1),
  },
  {
    id: "s2",
    productId: "p6",
    quantity: 5,
    unitPrice: 49,
    total: 245,
    customer: "Globex",
    date: daysAgo(2),
  },
  {
    id: "s3",
    productId: "p4",
    quantity: 1,
    unitPrice: 449,
    total: 449,
    customer: "Initech",
    date: daysAgo(3),
  },
  {
    id: "s4",
    productId: "p3",
    quantity: 3,
    unitPrice: 89,
    total: 267,
    customer: "Hooli",
    date: daysAgo(4),
  },
  {
    id: "s5",
    productId: "p8",
    quantity: 2,
    unitPrice: 199,
    total: 398,
    customer: "Stark Industries",
    date: daysAgo(5),
  },
  {
    id: "s6",
    productId: "p2",
    quantity: 1,
    unitPrice: 159,
    total: 159,
    customer: "Wayne Enterprises",
    date: daysAgo(6),
  },
  {
    id: "s7",
    productId: "p7",
    quantity: 4,
    unitPrice: 39,
    total: 156,
    customer: "Umbrella",
    date: daysAgo(7),
  },
  {
    id: "s8",
    productId: "p1",
    quantity: 1,
    unitPrice: 129,
    total: 129,
    customer: "Pied Piper",
    date: daysAgo(8),
  },
];

const seedPurchases: Purchase[] = [
  {
    id: "pu1",
    productId: "p2",
    quantity: 10,
    unitCost: 80,
    total: 800,
    supplier: "KeyTech Co.",
    date: daysAgo(2),
  },
  {
    id: "pu2",
    productId: "p6",
    quantity: 50,
    unitCost: 18,
    total: 900,
    supplier: "HubWorks",
    date: daysAgo(5),
  },
  {
    id: "pu3",
    productId: "p4",
    quantity: 8,
    unitCost: 230,
    total: 1840,
    supplier: "DeskMakers",
    date: daysAgo(9),
  },
];

function load(): State {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      products: seedProducts,
      sales: seedSales,
      purchases: seedPurchases,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  const initial: State = {
    user: null,
    token: null,
    products: seedProducts,
    sales: seedSales,
    purchases: seedPurchases,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

let state: State = load();
const listeners = new Set<() => void>();

function set(updater: (s: State) => State) {
  state = updater(state);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);

// ----- Auth (mock JWT) -----
export const auth = {
  login(email: string, password: string) {
    if (!email || !password) throw new Error("Email and password are required");
    const user: User = { id: uid(), name: email.split("@")[0] || "User", email };
    const token = "mock." + btoa(email) + "." + uid();
    set((s) => ({ ...s, user, token }));
    return user;
  },
  register(name: string, email: string, password: string) {
    if (!name || !email || !password) throw new Error("All fields are required");
    const user: User = { id: uid(), name, email };
    const token = "mock." + btoa(email) + "." + uid();
    set((s) => ({ ...s, user, token }));
    return user;
  },
  logout() {
    set((s) => ({ ...s, user: null, token: null }));
  },
  isAuthed() {
    return !!state.token;
  },
};

// ----- Products -----
export const products = {
  create(input: Omit<Product, "id">) {
    const p: Product = { ...input, id: uid() };
    set((s) => ({ ...s, products: [p, ...s.products] }));
    return p;
  },
  update(id: string, patch: Partial<Omit<Product, "id">>) {
    set((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  },
  remove(id: string) {
    set((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
      sales: s.sales.filter((x) => x.productId !== id),
      purchases: s.purchases.filter((x) => x.productId !== id),
    }));
  },
  adjustStock(id: string, delta: number) {
    set((s) => ({
      ...s,
      products: s.products.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
      ),
    }));
  },
  setStock(id: string, value: number) {
    set((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, value) } : p)),
    }));
  },
};

// ----- Sales (auto deduct stock) -----
export const sales = {
  create(input: { productId: string; quantity: number; unitPrice: number; customer: string }) {
    const prod = state.products.find((p) => p.id === input.productId);
    if (!prod) throw new Error("Product not found");
    if (input.quantity <= 0) throw new Error("Quantity must be positive");
    if (prod.stock < input.quantity)
      throw new Error(`Insufficient stock (${prod.stock} available)`);
    const sale: Sale = {
      id: uid(),
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      total: input.quantity * input.unitPrice,
      customer: input.customer || "Walk-in",
      date: new Date().toISOString(),
    };
    set((s) => ({
      ...s,
      sales: [sale, ...s.sales],
      products: s.products.map((p) =>
        p.id === input.productId ? { ...p, stock: p.stock - input.quantity } : p,
      ),
    }));
    return sale;
  },
  remove(id: string) {
    const sale = state.sales.find((s) => s.id === id);
    if (!sale) return;
    set((s) => ({
      ...s,
      sales: s.sales.filter((x) => x.id !== id),
      products: s.products.map((p) =>
        p.id === sale.productId ? { ...p, stock: p.stock + sale.quantity } : p,
      ),
    }));
  },
};

// ----- Purchases (auto increase stock) -----
export const purchases = {
  create(input: { productId: string; quantity: number; unitCost: number; supplier: string }) {
    const prod = state.products.find((p) => p.id === input.productId);
    if (!prod) throw new Error("Product not found");
    if (input.quantity <= 0) throw new Error("Quantity must be positive");
    const purchase: Purchase = {
      id: uid(),
      productId: input.productId,
      quantity: input.quantity,
      unitCost: input.unitCost,
      total: input.quantity * input.unitCost,
      supplier: input.supplier || "Unknown",
      date: new Date().toISOString(),
    };
    set((s) => ({
      ...s,
      purchases: [purchase, ...s.purchases],
      products: s.products.map((p) =>
        p.id === input.productId ? { ...p, stock: p.stock + input.quantity } : p,
      ),
    }));
    return purchase;
  },
  remove(id: string) {
    const pu = state.purchases.find((p) => p.id === id);
    if (!pu) return;
    set((s) => ({
      ...s,
      purchases: s.purchases.filter((x) => x.id !== id),
      products: s.products.map((p) =>
        p.id === pu.productId ? { ...p, stock: Math.max(0, p.stock - pu.quantity) } : p,
      ),
    }));
  },
};
