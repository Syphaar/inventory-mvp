import application from "./app";
import { config } from "./config";
import { seedDatabase } from "./data/seed";
import { prisma } from "./lib/prisma";

async function startServer(): Promise<void> {
  await prisma.$connect();
  console.log("Connected to database");

  await seedDatabase();

  application.listen(config.port, () => {
    console.log(`
  🚀 Server running on http://localhost:${config.port}
  📦 Environment: ${config.nodeEnv}
  🔒 Auth: JWT-based (secret configured)
  `);
  });
}

startServer().catch(async (error) => {
  console.error("Failed to start server:", error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
