import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { PRODUCTS } from "../../src/data/products";
import { memoryCartStore } from "../store/memoryStore";

export const cartRouter = Router();

const getMemoryCart = (userId: string) => {
  if (!memoryCartStore.has(userId)) {
    memoryCartStore.set(userId, new Map<string, number>());
  }
  return memoryCartStore.get(userId)!;
};

const getMemoryCartItems = (userId: string) => {
  const userCart = getMemoryCart(userId);
  const items: { product: any; quantity: number }[] = [];
  userCart.forEach((qty, pid) => {
    const prod = PRODUCTS.find((p) => p.id === pid);
    if (prod) {
      items.push({ product: prod, quantity: qty });
    }
  });
  return items;
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

// GET user's cart
cartRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId الزامی است" });
    }

    const uid = String(userId);

    if (isDatabaseConfigured) {
      try {
        const items = await prisma.cartItem.findMany({
          where: { userId: uid },
          include: { product: true },
        });
        if (items && items.length > 0) {
          return res.json(
            items.map((i) => ({
              product: i.product,
              quantity: i.quantity,
            })),
          );
        }
      } catch {
        // Fallback to memory store
      }
    }

    res.json(getMemoryCartItems(uid));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST add item to cart
cartRouter.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "userId و productId الزامی هستند" });
    }

    const uid = String(userId);
    const pid = String(productId);
    const qty =
      typeof quantity === "number" && quantity > 0 ? Math.floor(quantity) : 1;

    const userCart = getMemoryCart(uid);
    const currentQty = userCart.get(pid) || 0;
    userCart.set(pid, currentQty + qty);

    if (isDatabaseConfigured) {
      try {
        await ensureUserExists(uid);
        await ensureProductExists(pid);

        const existing = await prisma.cartItem.findUnique({
          where: {
            userId_productId: { userId: uid, productId: pid },
          },
        });

        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + qty },
          });
        } else {
          await prisma.cartItem.create({
            data: { userId: uid, productId: pid, quantity: qty },
          });
        }
      } catch {
        // In-memory store holds state safely
      }
    }

    res.json({
      success: true,
      message: "محصول با موفقیت به سبد خرید افزوده شد",
      cart: getMemoryCartItems(uid),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update cart item quantity
cartRouter.put("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "userId و productId الزامی هستند" });
    }

    const uid = String(userId);
    const pid = String(productId);
    const qty = Number(quantity);

    const userCart = getMemoryCart(uid);
    if (qty <= 0) {
      userCart.delete(pid);
    } else {
      userCart.set(pid, Math.floor(qty));
    }

    if (isDatabaseConfigured) {
      try {
        if (qty <= 0) {
          await prisma.cartItem.deleteMany({
            where: { userId: uid, productId: pid },
          });
        } else {
          const existing = await prisma.cartItem.findUnique({
            where: { userId_productId: { userId: uid, productId: pid } },
          });
          if (existing) {
            await prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: Math.floor(qty) },
            });
          } else {
            await ensureUserExists(uid);
            await ensureProductExists(pid);
            await prisma.cartItem.create({
              data: {
                userId: uid,
                productId: pid,
                quantity: Math.floor(qty),
              },
            });
          }
        }
      } catch {
        // In-memory store holds state safely
      }
    }

    res.json({ success: true, cart: getMemoryCartItems(uid) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remove item from cart
cartRouter.delete("/remove", async (req, res) => {
  try {
    const userId = req.body?.userId || req.query?.userId;
    const productId = req.body?.productId || req.query?.productId;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId و productId الزامی هستند" });
    }

    const uid = String(userId);
    const pid = String(productId);

    getMemoryCart(uid).delete(pid);

    if (isDatabaseConfigured) {
      try {
        await prisma.cartItem.deleteMany({
          where: { userId: uid, productId: pid },
        });
      } catch {
        // Handled in memory
      }
    }

    res.json({ success: true, cart: getMemoryCartItems(uid) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE clear cart
cartRouter.delete("/clear", async (req, res) => {
  try {
    const userId = req.body?.userId || req.query?.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId الزامی است" });
    }

    const uid = String(userId);
    getMemoryCart(uid).clear();

    if (isDatabaseConfigured) {
      try {
        await prisma.cartItem.deleteMany({
          where: { userId: uid },
        });
      } catch {
        // Handled in memory
      }
    }

    res.json({ success: true, message: "سبد خرید با موفقیت خالی شد" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
