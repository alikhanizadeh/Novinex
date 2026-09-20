import { startServer } from "./server/index";

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
