import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { memoryReviewStore } from "../store/memoryStore";

export const reviewsRouter = Router();

// GET reviews
reviewsRouter.get("/", async (req, res) => {
  try {
    const { productId } = req.query;

    if (!isDatabaseConfigured) {
      let list = [...memoryReviewStore];
      if (productId)
        list = list.filter((r) => r.productId === String(productId));
      return res.json(list);
    }

    const whereClause: any = {};
    if (productId) whereClause.productId = String(productId);

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        product: { select: { id: true, nameFa: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (reviews.length === 0 && !productId) {
      return res.json(memoryReviewStore);
    }

    res.json(reviews);
  } catch {
    res.json(memoryReviewStore);
  }
});

// POST submit review
reviewsRouter.post("/", async (req, res) => {
  try {
    const { name, role, rating, comment, productId, userId } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ error: "نام و متن نظر الزامی است" });
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      name,
      role: role || "سرآشپز و خریدار محصول",
      rating: Number(rating) || 5,
      comment,
      productId: productId || null,
      userId: userId || null,
      createdAt: new Date().toISOString(),
    };

    memoryReviewStore.unshift(newReview);

    if (!isDatabaseConfigured) {
      return res.status(201).json({ success: true, review: newReview });
    }

    const review = await prisma.review.create({
      data: {
        name,
        role: role || "سرآشپز و خریدار محصول",
        rating: Number(rating) || 5,
        comment,
        productId: productId || null,
        userId: userId || null,
      },
    });

    if (productId) {
      const prodReviews = await prisma.review.findMany({
        where: { productId },
      });
      if (prodReviews.length > 0) {
        const avg =
          prodReviews.reduce((sum, r) => sum + r.rating, 0) /
          prodReviews.length;
        await prisma.product.update({
          where: { id: productId },
          data: {
            rating: Number(avg.toFixed(1)),
            reviewsCount: prodReviews.length,
          },
        });
      }
    }

    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
