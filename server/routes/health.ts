import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { PRODUCTS, CATEGORIES } from "../../src/data/products";
import {
  memoryUserStore,
  memoryOrderStore,
  memoryReviewStore,
  memoryContactStore,
} from "../store/memoryStore";

export const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  const startTime = Date.now();

  if (!isDatabaseConfigured) {
    return res.json({
      status: "ok",
      database: "Local Memory Storage",
      connected: true,
      isConfigured: false,
      latencyMs: 1,
      message: "سیستم با ذخیره‌سازی محلی در حال اجرا است.",
      stats: {
        products: PRODUCTS.length,
        users: memoryUserStore.size,
        orders: memoryOrderStore.length,
        categories: CATEGORIES.length,
        reviews: memoryReviewStore.length,
        contactMessages: memoryContactStore.length,
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const [
      productCount,
      userCount,
      orderCount,
      categoryCount,
      reviewCount,
      contactCount,
    ] = await Promise.all([
      prisma.product.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.review.count().catch(() => 0),
      prisma.contactMessage.count().catch(() => 0),
    ]);

    const latencyMs = Date.now() - startTime;

    res.json({
      status: "ok",
      database: "Neon PostgreSQL (Prisma ORM)",
      connected: true,
      isConfigured: true,
      latencyMs,
      stats: {
        products: productCount,
        users: userCount,
        orders: orderCount,
        categories: categoryCount,
        reviews: reviewCount,
        contactMessages: contactCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.json({
      status: "ok",
      database: "Local Memory Storage (Fallback)",
      connected: true,
      isConfigured: false,
      latencyMs: Date.now() - startTime,
      stats: {
        products: PRODUCTS.length,
        users: memoryUserStore.size,
        orders: memoryOrderStore.length,
        categories: CATEGORIES.length,
        reviews: memoryReviewStore.length,
        contactMessages: memoryContactStore.length,
      },
      timestamp: new Date().toISOString(),
    });
  }
});
