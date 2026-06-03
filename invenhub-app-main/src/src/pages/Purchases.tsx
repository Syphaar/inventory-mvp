/**
 * Purchases Page
 *
 * Displays purchase orders and provides purchase recording features.
 *
 * Features:
 * - Purchase transaction list with product, supplier, quantity, cost
 * - Record new purchase (automatically adds to stock)
 * - Delete purchase (reverses stock increase)
 * - Filter by date range, supplier, product
 * - Purchase analytics (total cost, average order value)
 * - Supplier management
 *
 * Backend Integration:
 * - GET /api/purchases - Fetch all purchases
 * - POST /api/purchases - Record new purchase
 * - DELETE /api/purchases/:id - Delete purchase
 * - GET /api/purchases/stats - Get purchase statistics
 *
 * Stock Behavior:
 * - Creating a purchase automatically increases Product.stock
 * - Deleting a purchase automatically decreases Product.stock
 * - Backend updates stock levels immediately
 *
 * Connected Controllers:
 * - src/controllers/purchase.controller.ts
 *
 * Related Pages:
 * - /products to see products being purchased
 * - /stock to see stock levels after purchases
 * - /dashboard for purchase analytics
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Purchases Page Component
 */
export default function Purchases() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-muted-foreground mt-1">Track and record purchase orders</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Purchase
        </Button>
      </div>

      {/* Purchases Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Cost</div>
            <div className="text-2xl font-semibold mt-1">$0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Purchases
            </div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Avg Order Value
            </div>
            <div className="text-2xl font-semibold mt-1">$0</div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">Supplier</th>
                  <th className="py-2 font-medium text-right">Qty</th>
                  <th className="py-2 font-medium text-right">Unit Cost</th>
                  <th className="py-2 font-medium text-right">Total</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading purchases data...
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
