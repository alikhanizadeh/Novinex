import "dotenv/config";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createExpressApp } from "./app";

export async function startServer() {
  const app = createExpressApp();
  const PORT = 3000;

  // Vite middleware for development vs static build serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(require("express").static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `🚀 سرور با معماری ماژولار روی پورت ${PORT} آماده پاسخگویی است.`,
    );
  });

  return app;
}
