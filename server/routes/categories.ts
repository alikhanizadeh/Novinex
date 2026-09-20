import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { CATEGORIES } from "../../src/data/products";

export const categoriesRouter = Router();

// GET all categories with product counts
categoriesRouter.get("/", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.json(CATEGORIES);
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { nameFa: "asc" },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      nameFa: cat.nameFa,
      image: cat.image,
      count: cat._count?.products ?? cat.count,
    }));

    res.json(formatted);
  } catch {
    res.json(CATEGORIES);
  }
});

// GET single category
categoriesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isDatabaseConfigured) {
    const cat = CATEGORIES.find((c) => c.id === id);
    if (!cat) return res.status(404).json({ error: "دسته‌بندی یافت نشد" });
    return res.json(cat);
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      const local = CATEGORIES.find((c) => c.id === id);
      if (local) return res.json(local);
      return res.status(404).json({ error: "دسته‌بندی یافت نشد" });
    }

    res.json(category);
  } catch {
    const local = CATEGORIES.find((c) => c.id === id);
    if (local) return res.json(local);
    res.status(404).json({ error: "دسته‌بندی یافت نشد" });
  }
});

// POST create category
categoriesRouter.post("/", async (req, res) => {
  try {
    const { id, nameFa, image, count } = req.body;
    const catId = id || nameFa.toLowerCase().replace(/\s+/g, "-");
    if (isDatabaseConfigured) {
      const category = await prisma.category.create({
        data: {
          id: catId,
          nameFa,
          image,
          count: count || 0,
        },
      });
      return res.status(201).json(category);
    }
    res.status(201).json({ id: catId, nameFa, image, count: count || 0 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
