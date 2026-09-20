import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { memoryContactStore } from "../store/memoryStore";

export const contactRouter = Router();

// POST submit contact form
contactRouter.post("/", async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res
        .status(400)
        .json({ error: "نام، شماره تماس و پیام الزامی هستند" });
    }

    const contactData = {
      id: `msg_${Date.now()}`,
      name,
      phone,
      subject: subject || "مشاوره خرید ظروف و تجهیزات",
      message,
      status: "جدید",
      createdAt: new Date().toISOString(),
    };

    memoryContactStore.unshift(contactData);

    if (!isDatabaseConfigured) {
      return res.status(201).json({ success: true, contact: contactData });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        subject: subject || "مشاوره خرید ظروف و تجهیزات",
        message,
        status: "جدید",
      },
    });

    res.status(201).json({ success: true, contact });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET contact messages (Admin)
contactRouter.get("/", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.json(memoryContactStore);
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH contact message status
contactRouter.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isDatabaseConfigured) {
      const msg = memoryContactStore.find((m) => m.id === id);
      if (msg) msg.status = status;
      return res.json({ success: true, contact: msg });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, contact: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
