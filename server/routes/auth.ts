import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import {
  memoryUserStore,
  formatJoinedDate,
  normalizeUserResponse,
} from "../store/memoryStore";
import {
  sendOtpSms,
  verifyOtpCode,
  normalizePhoneNumber,
} from "../services/smsService";

export const authRouter = Router();

// =========================================================================
// 📲 OTP (4-Digit SMS Code) AUTHENTICATION
// =========================================================================

// POST /api/auth/send-otp: Send 4-digit code to phone number
authRouter.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, error: "شماره موبایل الزامی است" });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone || !/^09\d{9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        error:
          "شماره موبایل نامعتبر است. لطفاً شماره را مانند ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.",
      });
    }

    const result = await sendOtpSms(normalizedPhone);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.message });
    }

    res.json({
      success: true,
      message: result.message,
      phone: normalizedPhone,
      provider: result.provider,
      code: result.code, // In development/fallback mode, code is returned for quick testing
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/verify-otp: Verify 4-digit code and login or register user
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { phone, code, name } = req.body;
    if (!phone || !code) {
      return res
        .status(400)
        .json({
          success: false,
          error: "شماره موبایل و کد تأیید ۴ رقمی الزامی هستند",
        });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    const verification = verifyOtpCode(normalizedPhone, String(code));

    if (!verification.valid) {
      return res
        .status(400)
        .json({ success: false, error: verification.message });
    }

    // OTP verified successfully. Now find or create user.
    if (!isDatabaseConfigured) {
      let user = Array.from(memoryUserStore.values()).find(
        (u) => u.phone === normalizedPhone,
      );

      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          name: name?.trim() || `کاربر ${normalizedPhone.slice(-4)}`,
          email: `${normalizedPhone}@modernkitchen.ir`,
          phone: normalizedPhone,
          address: "",
          password: "otp_verified_user",
          role: "سرآشپز VIP",
          joinedDate: formatJoinedDate(new Date()),
          orders: [],
          createdAt: new Date().toISOString(),
        };
        memoryUserStore.set(user.id, user);
      } else if (name && name.trim()) {
        user.name = name.trim();
      }

      return res.json({
        success: true,
        message: "ورود با موفقیت انجام شد.",
        user: normalizeUserResponse(user),
      });
    }

    // Database mode
    let user = await prisma.user.findFirst({
      where: { phone: normalizedPhone },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!user) {
      // Auto-register user with this verified phone number
      const generatedEmail = `${normalizedPhone}@modernkitchen.ir`;
      user = await prisma.user.create({
        data: {
          name: name?.trim() || `کاربر ${normalizedPhone.slice(-4)}`,
          phone: normalizedPhone,
          email: generatedEmail,
          password: "otp_verified_user",
          role: "سرآشپز VIP",
        },
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: { include: { product: true } } },
          },
        },
      });
    } else if (name && name.trim() && user.name.startsWith("کاربر")) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: { include: { product: true } } },
          },
        },
      });
    }

    res.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
      user: normalizeUserResponse(user),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Register
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "نام و ایمیل الزامی هستند" });
    }

    const emailClean = String(email).trim().toLowerCase();
    const phoneClean = String(phone || "").trim();

    if (!isDatabaseConfigured) {
      let user = Array.from(memoryUserStore.values()).find(
        (u) => u.email === emailClean || (phoneClean && u.phone === phoneClean),
      );
      if (user) {
        Object.assign(user, {
          name,
          phone: phoneClean || user.phone,
          address: address || user.address,
          role: role || user.role,
          password: password || user.password,
        });
      } else {
        user = {
          id: `user_${Date.now()}`,
          name,
          email: emailClean,
          phone: phoneClean,
          address: address || "",
          password: password || "mk_secret_pass",
          role: role || "سرآشپز VIP",
          joinedDate: formatJoinedDate(new Date()),
          orders: [],
          createdAt: new Date().toISOString(),
        };
        memoryUserStore.set(user.id, user);
      }
      return res.json({ success: true, user: normalizeUserResponse(user) });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailClean },
          ...(phoneClean ? [{ phone: phoneClean }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "کاربری با این ایمیل یا شماره موبایل قبلاً ثبت‌نام کرده است.",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: emailClean,
        phone: phoneClean || null,
        address: address || null,
        password: password || "mk_secret_pass",
        role: role || "سرآشپز VIP",
      },
    });

    res.json({ success: true, user: normalizeUserResponse(user) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const emailClean = String(email || "")
      .trim()
      .toLowerCase();
    const phoneClean = String(phone || "").trim();

    if (!emailClean && !phoneClean) {
      return res
        .status(400)
        .json({ error: "ایمیل یا شماره موبایل الزامی است" });
    }

    if (!isDatabaseConfigured) {
      let user = Array.from(memoryUserStore.values()).find(
        (u) =>
          (emailClean && u.email === emailClean) ||
          (phoneClean && u.phone === phoneClean),
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "کاربر یافت نشد یا اطلاعات وارد شده درست نیست.",
        });
      }

      if (
        user.password &&
        password &&
        String(user.password) !== String(password)
      ) {
        return res.status(401).json({
          success: false,
          error: "رمز عبور نادرست است.",
        });
      }

      return res.json({ success: true, user: normalizeUserResponse(user) });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(emailClean ? [{ email: emailClean }] : []),
          ...(phoneClean ? [{ phone: phoneClean }] : []),
        ],
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "کاربر یافت نشد یا اطلاعات وارد شده درست نیست.",
      });
    }

    if (
      user.password &&
      password &&
      String(user.password) !== String(password)
    ) {
      return res.status(401).json({
        success: false,
        error: "رمز عبور نادرست است.",
      });
    }

    res.json({ success: true, user: normalizeUserResponse(user) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET Current User
authRouter.get("/me", async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ error: "شناسه یا ایمیل کاربر الزامی است" });
    }

    if (!isDatabaseConfigured) {
      const user = Array.from(memoryUserStore.values()).find(
        (u) =>
          (userId && u.id === String(userId)) ||
          (email && u.email === String(email).toLowerCase()),
      );
      if (!user) {
        return res.status(404).json({ error: "کاربر یافت نشد" });
      }
      return res.json(user);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          userId ? { id: String(userId) } : {},
          email ? { email: String(email).toLowerCase() } : {},
        ],
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: { include: { product: true } } },
        },
        wishlists: {
          include: { product: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "کاربر یافت نشد" });
    }

    res.json(normalizeUserResponse(user));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Update Profile
authRouter.put("/profile", async (req, res) => {
  try {
    const { id, email, name, phone, address, avatar, role } = req.body;

    if (!id && !email) {
      return res.status(400).json({ error: "شناسه کاربر الزامی است" });
    }

    if (!isDatabaseConfigured) {
      const user = Array.from(memoryUserStore.values()).find(
        (u) =>
          (id && u.id === id) || (email && u.email === email.toLowerCase()),
      );
      if (user) {
        Object.assign(user, { name, phone, address, avatar, role });
        return res.json({ success: true, user });
      }
      return res.status(404).json({ error: "کاربر یافت نشد" });
    }

    const user = await prisma.user.update({
      where: id ? { id } : { email: email.toLowerCase() },
      data: {
        name,
        phone,
        address,
        avatar,
        role,
      },
    });

    res.json({ success: true, user: normalizeUserResponse(user) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
