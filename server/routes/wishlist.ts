import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { PRODUCTS } from "../../src/data/products";
import { memoryWishlistStore } from "../store/memoryStore";

export const wishlistRouter = Router();

const ensureProductExists = async (productId: string) => {
  if (!isDatabaseConfigured) return;
  try {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existing) {
      const p = PRODUCTS.find((prod) => prod.id === productId);
      if (p) {
        const catId = p.category || "pots";
        await prisma.category
          .upsert({
            where: { id: catId },
            update: {},
            create: { id: catId, nameFa: catId, image: p.image, count: 1 },
          })
          .catch(() => {});

        await prisma.product
          .create({
            data: {
              id: p.id,
              nameFa: p.nameFa,
              nameEn: p.nameEn || null,
              brand: p.brand || "آشپزخانه مدرن",
              categoryId: catId,
              price: Number(p.price),
              originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
              rating: p.rating ? Number(p.rating) : 5.0,
              specs: p.specs || "",
              description: p.description || "",
              image: p.image || "",
            },
          })
          .catch(() => {});
      }
    }
  } catch {}
};

const ensureUserExists = async (userId: string) => {
  if (!isDatabaseConfigured) return;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      await prisma.user
        .create({
          data: {
            id: userId,
            name: "کاربر فروشگاه",
            email: `${userId}@modernkitchen.ir`,
            password: "password123",
            role: "عضو فروشگاه",
          },
        })
        .catch(() => {});
    }
  } catch {}
};

// GET user's wishlist
wishlistRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId الزامی است" });
    }

    const uid = String(userId);

    if (!isDatabaseConfigured) {
      const set = memoryWishlistStore.get(uid) || new Set<string>();
      const products = PRODUCTS.filter((p) => set.has(p.id));
      return res.json(products);
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: uid },
      include: { product: true },
    });

    res.json(items.map((i) => i.product));
  } catch {
    const uid = String(req.query.userId || "");
    const set = memoryWishlistStore.get(uid) || new Set<string>();
    const products = PRODUCTS.filter((p) => set.has(p.id));
    res.json(products);
  }
});

// POST toggle wishlist item
wishlistRouter.post("/toggle", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId و productId الزامی هستند" });
    }

    const uid = String(userId);
    const pid = String(productId);

    if (!memoryWishlistStore.has(uid)) {
      memoryWishlistStore.set(uid, new Set<string>());
    }
    const set = memoryWishlistStore.get(uid)!;
    let added = false;
    if (set.has(pid)) {
      set.delete(pid);
      added = false;
    } else {
      set.add(pid);
      added = true;
    }

    if (!isDatabaseConfigured) {
      return res.json({
        success: true,
        added,
        message: added
          ? "به علاقه‌مندی‌ها افزوده شد"
          : "از علاقه‌مندی‌ها حذف شد",
      });
    }

    try {
      await ensureUserExists(uid);
      await ensureProductExists(pid);

      const existing = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: { userId: uid, productId: pid },
        },
      });

      if (existing) {
        await prisma.wishlistItem.delete({
          where: { id: existing.id },
        });
        return res.json({
          success: true,
          added: false,
          message: "از علاقه‌مندی‌ها حذف شد",
        });
      } else {
        await prisma.wishlistItem.create({
          data: { userId: uid, productId: pid },
        });
        return res.json({
          success: true,
          added: true,
          message: "به علاقه‌مندی‌ها افزوده شد",
        });
      }
    } catch {
      return res.json({
        success: true,
        added,
        message: added
          ? "به علاقه‌مندی‌ها افزوده شد"
          : "از علاقه‌مندی‌ها حذف شد",
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
