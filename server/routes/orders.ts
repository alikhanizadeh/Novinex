import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { memoryOrderStore, memoryUserStore } from "../store/memoryStore";
import { sendOrderConfirmationSms } from "../services/smsService";

export const ordersRouter = Router();

// POST Create Order (Transactional)
ordersRouter.post("/", async (req, res) => {
  try {
    const { userId, recipientName, phone, address, items, totalAmount, notes } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "سبد خرید خالی است" });
    }

    if (!recipientName || !phone || !address) {
      return res
        .status(400)
        .json({ error: "اطلاعات گیرنده و آدرس الزامی است" });
    }

    // Generate distinctive tracking code MK-XXXXXX
    const trackingCode = "MK-" + Math.floor(100000 + Math.random() * 900000);

    if (!isDatabaseConfigured) {
      const order = {
        id: `order_${Date.now()}`,
        trackingCode,
        userId: userId || null,
        recipientName,
        phone,
        address,
        totalAmount: Number(totalAmount),
        notes: notes || null,
        status: "در حال پردازش",
        items: items.map((item: any) => ({
          id: `item_${Math.random().toString(36).substring(2, 9)}`,
          productId: item.product?.id,
          product: item.product,
          quantity: item.quantity,
          price: item.product?.price,
          selectedColor: item.selectedColor || null,
        })),
        createdAt: new Date().toISOString(),
      };

      memoryOrderStore.unshift(order);

      if (userId) {
        const user = memoryUserStore.get(userId);
        if (user) {
          user.orders = user.orders || [];
          user.orders.unshift(order);
        }
      }

      // Send SMS asynchronously
      sendOrderConfirmationSms({
        phone,
        recipientName,
        trackingCode,
        totalAmount: Number(totalAmount),
      }).catch((err) =>
        console.error("Failed to send order confirmation SMS:", err),
      );

      return res.status(201).json({ success: true, order, trackingCode });
    }

    let validUserId: string | null = null;
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (userExists) validUserId = userId;
    }

    for (const item of items) {
      const prod = item.product;
      if (prod && prod.id) {
        await prisma.product.upsert({
          where: { id: prod.id },
          update: {},
          create: {
            id: prod.id,
            nameFa: prod.nameFa,
            nameEn: prod.nameEn || null,
            brand: prod.brand || "آشپزخانه مدرن",
            categoryId: prod.categoryId || "pots",
            price: Number(prod.price),
            originalPrice: prod.originalPrice
              ? Number(prod.originalPrice)
              : null,
            rating: prod.rating ? Number(prod.rating) : 5.0,
            specs: prod.specs || "",
            description: prod.description || "",
            image: prod.image || "",
          },
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        trackingCode,
        userId: validUserId,
        recipientName,
        phone,
        address,
        totalAmount: Number(totalAmount),
        notes: notes || null,
        status: "در حال پردازش",
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            selectedColor: item.selectedColor || null,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Send SMS asynchronously
    sendOrderConfirmationSms({
      phone,
      recipientName,
      trackingCode,
      totalAmount: Number(totalAmount),
    }).catch((err) =>
      console.error("Failed to send order confirmation SMS:", err),
    );

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET Orders
ordersRouter.get("/", async (req, res) => {
  try {
    const { userId, trackingCode, status } = req.query;

    if (!isDatabaseConfigured) {
      let list = [...memoryOrderStore];
      if (userId) list = list.filter((o) => o.userId === String(userId));
      if (trackingCode) {
        const codeUpper = String(trackingCode).toUpperCase();
        list = list.filter((o) =>
          o.trackingCode?.toUpperCase().includes(codeUpper),
        );
      }
      if (status) list = list.filter((o) => o.status === String(status));
      return res.json(list);
    }

    const whereClause: any = {};
    if (userId) whereClause.userId = String(userId);
    if (trackingCode)
      whereClause.trackingCode = {
        contains: String(trackingCode).toUpperCase(),
      };
    if (status) whereClause.status = String(status);

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET single order by ID or tracking code
ordersRouter.get("/:idOrCode", async (req, res) => {
  try {
    const { idOrCode } = req.params;

    if (!isDatabaseConfigured) {
      const codeUpper = idOrCode.toUpperCase();
      const order = memoryOrderStore.find(
        (o) => o.id === idOrCode || o.trackingCode?.toUpperCase() === codeUpper,
      );
      if (!order) {
        return res
          .status(404)
          .json({ error: "سفارش با این کد رهگیری پیدا نشد" });
      }
      return res.json(order);
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: idOrCode }, { trackingCode: idOrCode.toUpperCase() }],
      },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "سفارش با این کد رهگیری پیدا نشد" });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update order status
ordersRouter.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isDatabaseConfigured) {
      const order = memoryOrderStore.find((o) => o.id === id);
      if (order) {
        order.status = status;
        return res.json({ success: true, order });
      }
      return res.status(404).json({ error: "سفارش یافت نشد" });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
