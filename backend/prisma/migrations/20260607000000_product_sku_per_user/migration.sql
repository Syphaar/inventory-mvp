-- Product SKUs should be unique within a user's inventory, not globally.
DROP INDEX IF EXISTS "Product_sku_key";

CREATE UNIQUE INDEX "Product_userId_sku_key" ON "Product"("userId", "sku");
