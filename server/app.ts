import express from "express";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { categoriesRouter } from "./routes/categories";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { wishlistRouter } from "./routes/wishlist";
import { cartRouter } from "./routes/cart";
import { reviewsRouter } from "./routes/reviews";
import { contactRouter } from "./routes/contact";
import { newsletterRouter } from "./routes/newsletter";
import { adminRouter } from "./routes/admin";

export function createExpressApp() {
  const app = express();

  // JSON Body Parser
  app.use(express.json());

  // CORS / Security headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Mount API Routers
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/newsletter", newsletterRouter);
  app.use("/api/admin", adminRouter);

  return app;
}
