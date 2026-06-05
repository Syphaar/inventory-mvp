import application from "./app";
import { config } from "./config";
import { seedDatabase } from "./data/seed";

async function startServer(): Promise<void> {
  await seedDatabase();

  application.listen(config.port, () => {
    console.log(`
  🚀 Server running on http://localhost:${config.port}
  📦 Environment: ${config.nodeEnv}
  🔒 Auth: JWT-based (secret configured)
  `);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
