import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { memorySubscriberStore } from "../store/memoryStore";

export const newsletterRouter = Router();

newsletterRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "آدرس ایمیل معتبر نیست" });
    }

    const cleanEmail = email.trim().toLowerCase();
    memorySubscriberStore.add(cleanEmail);

    if (!isDatabaseConfigured) {
      return res
        .status(201)
        .json({ success: true, subscriber: { email: cleanEmail } });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: {},
      create: { email: cleanEmail },
    });

    res.status(201).json({ success: true, subscriber });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

newsletterRouter.get("/", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.json(
      Array.from(memorySubscriberStore).map((email) => ({ email })),
    );
  }

  try {
    const list = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
