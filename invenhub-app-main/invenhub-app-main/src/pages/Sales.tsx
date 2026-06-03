/**
 * Sales Page
 *
 * Displays sales transactions and provides sales recording features.
 *
 * Features:
 * - Sales transaction list with product, customer, quantity, price
 * - Record new sale (automatically deducts from stock)
 * - Delete/refund sale (reverses stock deduction)
 * - Filter by date range, customer, product
 * - Sales analytics (total revenue, average transaction)
 * - Export sales data
 *
 * Backend Integration:
 * - GET /api/sales - Fetch all sales
 * - POST /api/sales - Record new sale
 * - DELETE /api/sales/:id - Delete/refund sale
 * - GET /api/sales/stats - Get sales statistics
 *
 * Stock Behavior:
 * - Creating a sale automatically deducts from Product.stock
 * - Deleting a sale automatically restores Product.stock
 * - Backend validates sufficient stock before creating sale
 *
 * Connected Controllers:
 * - src/controllers/sale.controller.ts
 *
 * Related Pages:
 * - /products to see products being sold
 * - /stock to see stock levels after sales
 * - /dashboard for sales analytics
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Sales Page Component
 */
export default function Sales() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground mt-1">Track and record sales transactions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </div>
            <div className="text-2xl font-semibold mt-1">$0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Sales
            </div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Avg Transaction
            </div>
            <div className="text-2xl font-semibold mt-1">$0</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sales Transactions</CardTitle>
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
                  <th className="py-2 font-medium text-right">Unit Price</th>
                  <th className="py-2 font-medium text-right">Total</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading sales data...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
