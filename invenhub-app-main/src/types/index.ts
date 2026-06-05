export type { User, LoginRequest, RegisterRequest, ApiResponse } from "./auth.types";

export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
} from "./product.types";

export type { StockItem, AdjustStockRequest, SetStockRequest, StockResponse } from "./stock.types";

export type {
  Sale,
  SaleWithProduct,
  CreateSaleRequest,
  SalesResponse,
  SalesStats,
} from "./sale.types";

export type {
  Purchase,
  PurchaseWithProduct,
  CreatePurchaseRequest,
  PurchasesResponse,
  PurchaseStats,
} from "./purchase.types";
