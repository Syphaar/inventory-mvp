/**
 * Stock Page
 *
 * Displays inventory stock levels and provides stock management features.
 *
 * Features:
 * - Stock level view for all products
 * - Low stock alerts with visual indicators
 * - Adjust stock quantities (increase/decrease)
 * - Set absolute stock quantity (after inventory count)
 * - Filter by low stock items
 * - Stock history/audit trail
 *
 * Backend Integration:
 * - GET /api/stocks - Fetch all stock levels
 * - GET /api/stocks?low=true - Get low stock items
 * - PATCH /api/stocks/:productId/adjust - Adjust quantity
 * - PATCH /api/stocks/:productId/set - Set absolute quantity
 *
 * Connected Controllers:
 * - src/controllers/stock.controller.ts or embedded in product.controller.ts
 *
 * Related Pages:
 * - /products for product information
 * - /sales when recording sales (automatic stock deduction)
 * - /purchases when recording purchases (automatic stock increase)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Stock Page Component
 */
export default function Stock() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage inventory levels</p>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Stock Value
            </div>
            <div className="text-2xl font-semibold mt-1">$0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Low Stock Items
            </div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Products Tracked
            </div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">SKU</th>
                  <th className="py-2 font-medium text-right">Current Stock</th>
                  <th className="py-2 font-medium text-right">Threshold</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading stock data...
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
