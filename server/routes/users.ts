import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { memoryUserStore } from "../store/memoryStore";

export const usersRouter = Router();

// GET all users (Admin)
usersRouter.get("/", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.json(Array.from(memoryUserStore.values()));
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true, reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
