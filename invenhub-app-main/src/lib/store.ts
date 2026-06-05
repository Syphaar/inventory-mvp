import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { productApi } from "@/api/product.api";
import { saleApi } from "@/api/sale.api";
import { purchaseApi } from "@/api/purchase.api";
import { stockApi } from "@/api/stock.api";
import { authApi } from "@/api/auth.api";
import { queryClient } from "./query-client";
import type { Product } from "@/types/product.types";
import type { Sale, CreateSaleRequest } from "@/types/sale.types";
import type { Purchase, CreatePurchaseRequest } from "@/types/purchase.types";
import type { User } from "@/types/auth.types";

// ----- Auth state (synchronous, backed by localStorage like before) -----

type AuthState = {
  user: User | null;
  token: string | null;
};

let authState: AuthState = loadAuth();
const authListeners = new Set<() => void>();

function loadAuth(): AuthState {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const token = localStorage.getItem("auth_token");
    const raw = localStorage.getItem("auth_user");
    return { user: raw ? JSON.parse(raw) : null, token };
  } catch {
    return { user: null, token: null };
  }
}

function saveAuth(user: User | null, token: string | null) {
  authState = { user, token };
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }
  authListeners.forEach((fn) => fn());
}

function subscribeAuth(listener: () => void) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function getAuthSnapshot() {
  return authState;
}

export function useStoreAuth<T>(selector: (s: AuthState) => T): T {
  return useSyncExternalStore(
    subscribeAuth,
    () => selector(authState),
    () => selector(authState),
  );
}

// ----- Data hooks (React Query) -----

const STALE = 1000 * 30;

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
    staleTime: STALE,
  });
}

export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: saleApi.getAll,
    staleTime: STALE,
  });
}

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: purchaseApi.getAll,
    staleTime: STALE,
  });
}

export function useStockItems() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: stockApi.getAll,
    staleTime: STALE,
  });
}

// ----- Mutations -----

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Product, "id" | "userId" | "createdAt" | "updatedAt">) =>
      productApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSaleRequest) => saleApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => saleApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePurchaseRequest) => purchaseApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useDeletePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) =>
      stockApi.adjustStock(id, { delta }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useSetStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      stockApi.setStock(id, { quantity }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

// ----- Auth API -----

export const auth = {
  async login(email: string, password: string) {
    try {
      const result = await authApi.login(email, password);
      saveAuth(result.user, result.accessToken);
      queryClient.clear();
      return result.user;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || "Login failed");
    }
  },
  async register(name: string, email: string, password: string) {
    try {
      const result = await authApi.register(name, email, password);
      saveAuth(result.user, result.accessToken);
      queryClient.clear();
      return result.user;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || "Registration failed");
    }
  },
  logout() {
    saveAuth(null, null);
    queryClient.clear();
  },
  isAuthed() {
    return !!authState.token;
  },
};

export type { Product } from "@/types/product.types";
export type { Sale } from "@/types/sale.types";
export type { Purchase } from "@/types/purchase.types";

export const products = {
  create(input: Omit<Product, "id" | "userId" | "createdAt" | "updatedAt">) {
    throw new Error("Use useCreateProduct mutation hook instead");
  },
  update(id: string, patch: Partial<Omit<Product, "id">>) {
    throw new Error("Use useUpdateProduct mutation hook instead");
  },
  remove(id: string) {
    throw new Error("Use useDeleteProduct mutation hook instead");
  },
  adjustStock(id: string, delta: number) {
    throw new Error("Use useAdjustStock mutation hook instead");
  },
  setStock(id: string, value: number) {
    throw new Error("Use useSetStock mutation hook instead");
  },
};

export const sales = {
  create(input: { productId: string; quantity: number; unitPrice: number; customer: string }) {
    throw new Error("Use useCreateSale mutation hook instead");
  },
  remove(id: string) {
    throw new Error("Use useDeleteSale mutation hook instead");
  },
};

export const purchases = {
  create(input: { productId: string; quantity: number; unitCost: number; supplier: string }) {
    throw new Error("Use useCreatePurchase mutation hook instead");
  },
  remove(id: string) {
    throw new Error("Use useDeletePurchase mutation hook instead");
  },
};
