import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { PRODUCTS, CATEGORIES } from "../../src/data/products";
import {
  memoryOrderStore,
  memoryUserStore,
  memorySubscriberStore,
  memoryReviewStore,
} from "../store/memoryStore";

export const adminRouter = Router();

// GET admin statistics
adminRouter.get("/stats", async (req, res) => {
  if (!isDatabaseConfigured) {
    const totalRevenue = memoryOrderStore.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );
    return res.json({
      totalProducts: PRODUCTS.length,
      totalOrders: memoryOrderStore.length,
      totalUsers: memoryUserStore.size,
      totalSubscribers: memorySubscriberStore.size,
      totalReviews: memoryReviewStore.length,
      totalRevenue,
    });
  }

  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalSubscribers,
      totalReviews,
      orders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.newsletterSubscriber.count(),
      prisma.review.count(),
      prisma.order.findMany({ select: { totalAmount: true } }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalSubscribers,
      totalReviews,
      totalRevenue,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Sync / Seed default data to Neon PostgreSQL
adminRouter.post("/seed", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.json({
      success: true,
      message:
        "سیستم با داده‌های پیش‌فرض در حافظه آماده است. برای اتصال به Neon، متغیر DATABASE_URL را در تنظیمات وارد نمایید.",
    });
  }

  try {
    // 1. Seed Categories
    for (const cat of CATEGORIES) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: { nameFa: cat.nameFa, image: cat.image, count: cat.count },
        create: {
          id: cat.id,
          nameFa: cat.nameFa,
          image: cat.image,
          count: cat.count,
        },
      });
    }

    // 2. Seed Products
    for (const prod of PRODUCTS) {
      await prisma.product.upsert({
        where: { id: prod.id },
        update: {
          nameFa: prod.nameFa,
          nameEn: prod.nameEn,
          brand: prod.brand,
          categoryId: prod.category,
          price: prod.price,
          originalPrice: prod.originalPrice,
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
          badge: prod.badge,
          isSpecialOffer: prod.isSpecialOffer ?? false,
          isFeatured: prod.isFeatured ?? false,
          inStock: prod.inStock ?? true,
          material: prod.material,
          origin: prod.origin,
          specs: prod.specs,
          description: prod.description,
          image: prod.image,
          gallery: prod.gallery ? JSON.stringify(prod.gallery) : null,
        },
        create: {
          id: prod.id,
          nameFa: prod.nameFa,
          nameEn: prod.nameEn,
          brand: prod.brand,
          categoryId: prod.category,
          price: prod.price,
          originalPrice: prod.originalPrice,
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
          badge: prod.badge,
          isSpecialOffer: prod.isSpecialOffer ?? false,
          isFeatured: prod.isFeatured ?? false,
          inStock: prod.inStock ?? true,
          material: prod.material,
          origin: prod.origin,
          specs: prod.specs,
          description: prod.description,
          image: prod.image,
          gallery: prod.gallery ? JSON.stringify(prod.gallery) : null,
        },
      });
    }

    res.json({
      success: true,
      message:
        "تمامی اطلاعات اولیه با موفقیت در پایگاه‌داده Neon PostgreSQL درج شدند.",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
