import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

export async function seedDatabase(): Promise<void> {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const hashedPassword = await hashPassword("password123");

  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@example.com", password: hashedPassword },
  });

  const john = await prisma.user.create({
    data: { name: "John Doe", email: "john@example.com", password: hashedPassword },
  });

  const jane = await prisma.user.create({
    data: { name: "Jane Smith", email: "jane@example.com", password: hashedPassword },
  });

  const adminProducts = await Promise.all([
    prisma.product.create({ data: { sku: "LAP-001", name: "MacBook Pro 14", category: "Laptops", price: 1999.99, cost: 1599.99, stock: 150, lowStockThreshold: 20, userId: admin.id } }),
    prisma.product.create({ data: { sku: "LAP-002", name: "Dell XPS 15", category: "Laptops", price: 1499.99, cost: 1199.99, stock: 200, lowStockThreshold: 20, userId: admin.id } }),
    prisma.product.create({ data: { sku: "MON-001", name: "LG UltraFine 27", category: "Monitors", price: 699.99, cost: 549.99, stock: 317, lowStockThreshold: 15, userId: admin.id } }),
    prisma.product.create({ data: { sku: "MON-002", name: "Dell UltraSharp 32", category: "Monitors", price: 1099.99, cost: 849.99, stock: 140, lowStockThreshold: 10, userId: admin.id } }),
    prisma.product.create({ data: { sku: "ACC-001", name: "Logitech MX Master 3S", category: "Accessories", price: 99.99, cost: 69.99, stock: 500, lowStockThreshold: 50, userId: admin.id } }),
    prisma.product.create({ data: { sku: "ACC-002", name: "Apple Magic Keyboard", category: "Accessories", price: 149.99, cost: 109.99, stock: 350, lowStockThreshold: 30, userId: admin.id } }),
    prisma.product.create({ data: { sku: "PRN-001", name: "HP LaserJet Pro", category: "Printers", price: 299.99, cost: 219.99, stock: 180, lowStockThreshold: 15, userId: admin.id } }),
    prisma.product.create({ data: { sku: "PRN-002", name: "Brother HL-L2370DW", category: "Printers", price: 159.99, cost: 119.99, stock: 220, lowStockThreshold: 20, userId: admin.id } }),
  ]);

  const johnProducts = await Promise.all([
    prisma.product.create({ data: { sku: "PHN-001", name: "iPhone 15 Pro", category: "Phones", price: 1099.99, cost: 899.99, stock: 120, lowStockThreshold: 10, userId: john.id } }),
    prisma.product.create({ data: { sku: "PHN-002", name: "Samsung Galaxy S24", category: "Phones", price: 999.99, cost: 799.99, stock: 300, lowStockThreshold: 20, userId: john.id } }),
    prisma.product.create({ data: { sku: "PHN-003", name: "Google Pixel 8", category: "Phones", price: 799.99, cost: 649.99, stock: 250, lowStockThreshold: 15, userId: john.id } }),
    prisma.product.create({ data: { sku: "PHN-004", name: "OnePlus 12", category: "Phones", price: 899.99, cost: 729.99, stock: 190, lowStockThreshold: 15, userId: john.id } }),
    prisma.product.create({ data: { sku: "TAB-001", name: "iPad Air", category: "Tablets", price: 599.99, cost: 449.99, stock: 180, lowStockThreshold: 15, userId: john.id } }),
    prisma.product.create({ data: { sku: "TAB-002", name: "Samsung Galaxy Tab S9", category: "Tablets", price: 799.99, cost: 629.99, stock: 160, lowStockThreshold: 10, userId: john.id } }),
    prisma.product.create({ data: { sku: "WCH-001", name: "Apple Watch Series 9", category: "Wearables", price: 399.99, cost: 319.99, stock: 275, lowStockThreshold: 25, userId: john.id } }),
    prisma.product.create({ data: { sku: "WCH-002", name: "Samsung Galaxy Watch 6", category: "Wearables", price: 349.99, cost: 279.99, stock: 210, lowStockThreshold: 20, userId: john.id } }),
  ]);

  const janeProducts = await Promise.all([
    prisma.product.create({ data: { sku: "STO-001", name: "Samsung T7 1TB", category: "Storage", price: 159.99, cost: 109.99, stock: 250, lowStockThreshold: 25, userId: jane.id } }),
    prisma.product.create({ data: { sku: "STO-002", name: "WD My Passport 2TB", category: "Storage", price: 89.99, cost: 64.99, stock: 400, lowStockThreshold: 40, userId: jane.id } }),
    prisma.product.create({ data: { sku: "STO-003", name: "SanDisk Extreme 1TB", category: "Storage", price: 129.99, cost: 89.99, stock: 320, lowStockThreshold: 30, userId: jane.id } }),
    prisma.product.create({ data: { sku: "NET-001", name: "TP-Link Archer AX73", category: "Networking", price: 129.99, cost: 89.99, stock: 230, lowStockThreshold: 20, userId: jane.id } }),
    prisma.product.create({ data: { sku: "NET-002", name: "Netgear Nighthawk AX5400", category: "Networking", price: 199.99, cost: 149.99, stock: 175, lowStockThreshold: 15, userId: jane.id } }),
    prisma.product.create({ data: { sku: "CBL-001", name: "Anker USB-C Cable 6ft", category: "Cables", price: 14.99, cost: 8.99, stock: 1000, lowStockThreshold: 100, userId: jane.id } }),
    prisma.product.create({ data: { sku: "CBL-002", name: "Belkin HDMI 2.1 Cable", category: "Cables", price: 24.99, cost: 14.99, stock: 750, lowStockThreshold: 75, userId: jane.id } }),
    prisma.product.create({ data: { sku: "CBL-003", name: "UGREEN Ethernet Cable 10ft", category: "Cables", price: 9.99, cost: 5.99, stock: 850, lowStockThreshold: 80, userId: jane.id } }),
  ]);

  const allProducts = [...adminProducts, ...johnProducts, ...janeProducts];

  await Promise.all([
    prisma.sale.create({ data: { productId: adminProducts[0].id, quantity: 2, unitPrice: 1999.99, total: 3999.98, customer: "Alice Corp" } }),
    prisma.sale.create({ data: { productId: adminProducts[4].id, quantity: 10, unitPrice: 99.99, total: 999.90, customer: "Bob Industries" } }),
    prisma.sale.create({ data: { productId: johnProducts[0].id, quantity: 1, unitPrice: 1099.99, total: 1099.99, customer: "Bob Industries" } }),
    prisma.sale.create({ data: { productId: johnProducts[1].id, quantity: 2, unitPrice: 999.99, total: 1999.98, customer: "Frank Group" } }),
    prisma.sale.create({ data: { productId: johnProducts[4].id, quantity: 5, unitPrice: 599.99, total: 2999.95, customer: "Diana Enterprises" } }),
    prisma.sale.create({ data: { productId: janeProducts[0].id, quantity: 10, unitPrice: 159.99, total: 1599.90, customer: "Eve Technologies" } }),
    prisma.sale.create({ data: { productId: janeProducts[3].id, quantity: 3, unitPrice: 129.99, total: 389.97, customer: "Charlie Ltd" } }),
    prisma.sale.create({ data: { productId: janeProducts[5].id, quantity: 50, unitPrice: 14.99, total: 749.50, customer: "Grace Solutions" } }),
    prisma.sale.create({ data: { productId: adminProducts[2].id, quantity: 1, unitPrice: 699.99, total: 699.99, customer: "Grace Solutions" } }),
  ]);

  await Promise.all([
    prisma.purchase.create({ data: { productId: adminProducts[0].id, quantity: 10, unitCost: 1599.99, total: 15999.90, supplier: "Apple Distributor" } }),
    prisma.purchase.create({ data: { productId: adminProducts[6].id, quantity: 20, unitCost: 219.99, total: 4399.80, supplier: "HP Direct" } }),
    prisma.purchase.create({ data: { productId: johnProducts[0].id, quantity: 20, unitCost: 899.99, total: 17999.80, supplier: "Samsung Wholesale" } }),
    prisma.purchase.create({ data: { productId: janeProducts[0].id, quantity: 50, unitCost: 109.99, total: 5499.50, supplier: "TechSupply Co" } }),
    prisma.purchase.create({ data: { productId: janeProducts[1].id, quantity: 60, unitCost: 64.99, total: 3899.40, supplier: "WD Distributor" } }),
    prisma.purchase.create({ data: { productId: janeProducts[5].id, quantity: 200, unitCost: 8.99, total: 1798.00, supplier: "Anker Wholesale" } }),
  ]);

  console.log("Seed data loaded successfully");
  console.log(`  Users: ${await prisma.user.count()}`);
  console.log(`  Products: ${await prisma.product.count()}`);
  console.log(`  Sales: ${await prisma.sale.count()}`);
  console.log(`  Purchases: ${await prisma.purchase.count()}`);
}
