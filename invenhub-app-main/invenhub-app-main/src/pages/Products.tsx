/**
 * Products Page
 *
 * Displays list of all products with inventory management features.
 *
 * Features:
 * - Product list/table with SKU, name, category, price, cost, stock
 * - Add new product button
 * - Edit product functionality
 * - Delete product with confirmation
 * - Search/filter by product name or category
 * - Stock level indicators
 *
 * Backend Integration:
 * - GET /api/products - Fetch all products
 * - POST /api/products - Create new product
 * - PUT /api/products/:id - Update product
 * - DELETE /api/products/:id - Delete product
 *
 * Connected Controllers:
 * - src/controllers/product.controller.ts
 *
 * Related Pages:
 * - /stock for stock management
 * - /sales when recording sales
 * - /purchases when recording purchases
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Products Page Component
 */
export default function Products() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory products</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2 font-medium">SKU</th>
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Category</th>
                  <th className="py-2 font-medium text-right">Price</th>
                  <th className="py-2 font-medium text-right">Cost</th>
                  <th className="py-2 font-medium text-right">Stock</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading products...
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
