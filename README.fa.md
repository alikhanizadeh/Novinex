<div align="center" dir="rtl">

# 🍳 آشپزخانه مدرن (Modern Kitchen)

**فروشگاه آنلاین فول‌استک تجهیزات و ظروف لوکس آشپزخانه**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

### 🌐 پشتیبانی چندزبانه (Multi-Language Support)

[![English](https://img.shields.io/badge/Language-English-1e293b?style=for-the-badge)](./README.md)
[![Persian](<https://img.shields.io/badge/زبان-فارسی_(فعال)-f09267?style=for-the-badge>)](./README.fa.md)

**زبان‌های در دسترس:**  
[**English**](./README.md) | [**فارسی (Persian)**](./README.fa.md)

</div>

---

<div dir="rtl">

## 📖 معرفی پروژه

**آشپزخانه مدرن (Modern Kitchen)** یک وب‌اپلیکیشن فروشگاهی مدرن، راست‌چین (RTL) و فول‌استک برای نمایش و فروش تجهیزات آشپزخانه، قابلمه، ماهیتابه، ظروف پذیرایی و لوازم برقی است. این پروژه ظاهر شیشه‌ای و مدرن **React 19 + Tailwind CSS v4** را با یک بک‌اند قدرتمند **Express.js + Prisma (PostgreSQL)** ترکیب می‌کند و دارای سیستم حافظه داخلی جایگزین (In-Memory Fallback) است تا حتی بدون اتصال به دیتابیس نیز بلافاصله اجرا و تست شود.

---

## ✨ امکانات کلیدی

- **🔐 ورود و ثبت‌نام دوحالته + ارسال کد تأیید پیامکی (۴ رقمی OTP)**
  - دو حالت تمیز **ورود** و **ثبت‌نام** همراه با ارسال و بررسی کد تأیید ۴ رقمی (`/api/auth/send-otp` و `/api/auth/verify-otp`).
  - سازگار با پنل‌های پیامکی **کاوه‌نگار (Kavenegar)**، **فراز اس‌ام‌اس / IPPanel**، **ملی‌پیامک** و حالت تست خودکار در محیط توسعه.
  - **مدال هوشمند احراز هویت (`AuthRequiredModal`)**: در صورتی که کاربر وارد حساب نشده باشد و بخواهد محصولی را به سبد خرید یا علاقه‌مندی‌ها اضافه کند، پیغام راهنما به همراه دکمه هدایت مستقیم به ثبت‌نام نمایش داده می‌شود.
- **🔍 جستجوی زنده و هوشمند (Live Search)**
  - نمایش آنی لیست کالاهای مرتبط هنگام تایپ همراه با تصویر، نام محصول، برند و قیمت به تومان.
  - **تجربه کاربری بهینه در موبایل**: از اسکرول ناخواسته و پرش صفحه هنگام تایپ در موبایل جلوگیری می‌کند؛ اسکرول فقط زمانی انجام می‌شود که کاربر یکی از پیشنهادات را انتخاب کند یا نتیجه معتبری وجود داشته باشد. در غیر این صورت پیام واضح «کالایی با این عنوان یا مشخصات یافت نشد» نمایش داده می‌شود.
- **🧭 هدر ریسپانسیو و راست‌چین (RTL Header)**
  - قرارگیری ثابت لوگو و نام برند در گوشه سمت راست و آیکون حساب کاربری و سبد خرید در گوشه سمت چپ در تمامی صفحات.
  - کادر جستجوی کامل در دسکتاپ و آیکون جستجو به همراه دکمه منو در موبایل.
- **🛒 سبد خرید، علاقه‌مندی‌ها و ثبت سفارش**
  - کشوهای تعاملی سبد خرید و علاقه‌مندی‌ها، تغییر تعداد، انتخاب رنگ محصول و صدور کد رهگیری سفارش.
- **📦 بک‌اند ماژولار با پشتیبانی خودکار بدون دیتابیس**
  - API کامل با **Express.js** و **Prisma ORM (PostgreSQL / Neon)** همراه با ذخیره‌سازی موقت در حافظه در صورت تنظیم‌نشدن `DATABASE_URL`.
- **☁️ آماده استقرار در Vercel**
  - مجهز به فایل‌های `vercel.json` و `/api/index.ts` برای اجرای هم‌زمان فرانت‌اند و APIهای سرورلس روی ورسل.

---

## 🛠️ تکنولوژی‌های استفاده‌شده

| بخش                      | ابزارها و فریم‌ورک‌ها                                                   |
| :----------------------- | :---------------------------------------------------------------------- |
| **فرانت‌اند (Frontend)** | React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Lucide React, Motion |
| **بک‌اند (Backend)**     | Node.js, Express.js 4, REST API                                         |
| **دیتابیس و ORM**        | Prisma 6, PostgreSQL (Neon / Cloud SQL) + In-Memory Store Fallback      |
| **پیامک و هوش مصنوعی**   | کاوه‌نگار / IPPanel / ملی‌پیامک (OTP) و `@google/genai`                 |
| **استقرار (Deploy)**     | Vercel (Static Build + Serverless Functions)                            |

---

## 📂 ساختار پوشه‌های پروژه

</div>

```text
├── api/
│   └── index.ts                 # نقطه ورود سرورلس Vercel برای اجرای Express
├── prisma/
│   ├── schema.prisma            # مدل‌های دیتابیس PostgreSQL (کاربر، محصول، سفارش و...)
│   └── seed.ts                  # اسکریپت داده‌های اولیه دیتابیس
├── server/
│   ├── app.ts                   # تنظیمات اصلی Express، CORS و مسیرهای API
│   ├── index.ts                 # سرور محلی Node/Vite برای اجرا در حالت توسعه و پروداکشن
│   ├── routes/                  # روترهای API (auth، products، cart، orders و...)
│   ├── services/                # سرویس‌های پیامک OTP و منطق برنامه
│   └── store/                   # حافظه موقت جایگزین در نبود دیتابیس
├── src/
│   ├── components/              # کامپوننت‌های رابط کاربری (Header، Hero، مودال‌ها و...)
│   ├── data/                    # داده‌های اولیه کاتالوگ محصولات
│   ├── lib/                     # توابع کمکی (اعداد فارسی و قیمت تومان) و کلاینت Prisma
│   ├── App.tsx                  # مدیریت وضعیت اصلی و صفحات برنامه
│   └── types.ts                 # تایپ‌های TypeScript مشترک
├── server.ts                    # فایل اجرایی سرور توسعه
├── vercel.json                  # تنظیمات مسیریابی API در Vercel
└── package.json                 # اسکریپت‌ها و پکیج‌های پروژه
```

<div dir="rtl">

---

## 🚀 راهنمای نصب و اجرای محلی

### ۱. کلون کردن مخزن

```bash
git clone https://github.com/your-username/modern-kitchen.git
cd modern-kitchen
```

### ۲. نصب پکیج‌ها

```bash
npm install
```

### ۳. تنظیم متغیرهای محیطی (اختیاری)

فایل `.env.example` را به `.env` کپی کنید (برای اجرای آزمایشی بدون دیتابیس هم برنامه بدون مشکل کار می‌کند):

```bash
cp .env.example .env
```

| متغیر                               | توضیح                                       | وضعیت                                             |
| :---------------------------------- | :------------------------------------------ | :------------------------------------------------ |
| `DATABASE_URL`                      | آدرس اتصال PostgreSQL (مثلاً Neon)          | اختیاری (در نبود آن از حافظه موقت استفاده می‌شود) |
| `DIRECT_URL`                        | آدرس مستقیم PostgreSQL برای مایگریشن Prisma | اختیاری                                           |
| `GEMINI_API_KEY`                    | کلید API جمنای برای قابلیت‌های سمت سرور     | اختیاری                                           |
| `SMS_PROVIDER`                      | `kavenegar`، `ippanel` یا `melipayamak`     | اختیاری (در حالت تست کد در پاسخ برمی‌گردد)        |
| `KAVENEGAR_API_KEY` / `SMS_API_KEY` | کلید API پنل پیامک                          | اختیاری                                           |

### ۴. راه‌اندازی دیتابیس (در صورت اتصال PostgreSQL)

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### ۵. اجرای پروژه در حالت توسعه

```bash
npm run dev
```

سایت روی آدرس **`http://localhost:3000`** در دسترس خواهد بود.

---

## 📜 اسکریپت‌های کاربردی

| دستور                   | عملکرد                                                       |
| :---------------------- | :----------------------------------------------------------- |
| `npm run dev`           | اجرای هم‌زمان فرانت‌اند Vite و سرور Express روی پورت `3000`  |
| `npm run build`         | بیلد نهایی کلاینت (`dist/`) و باندل سرور (`dist/server.cjs`) |
| `npm start`             | اجرای نسخه پروداکشن سرور Node.js                             |
| `npm run lint`          | بررسی خطاهای تایپی TypeScript (`tsc --noEmit`)               |
| `npm run prisma:studio` | باز کردن پنل گرافیکی دیتابیس Prisma                          |

---

## 🌐 راهنمای انتشار روی Vercel

این پروژه به صورت پیش‌فرض برای **Vercel** آماده شده است:

1. پروژه را در **GitHub** پوش (Push) کنید.
2. وارد سایت [vercel.com](https://vercel.com) شوید و روی **Add New → Project** کلیک کنید.
3. مخزن گیت‌هاب خود را **Import** کنید.
4. تنظیمات پیش‌فرض **Vite** (`Build Command: npm run build` و `Output Directory: dist`) را تایید کنید.
5. در صورت نیاز متغیرهای محیطی (`DATABASE_URL`، `SMS_API_KEY` و...) را در بخش **Environment Variables** وارد کنید.
6. روی **Deploy** کلیک کنید؛ فایل `vercel.json` به صورت خودکار تمام درخواست‌های `/api/*` را به `/api/index.ts` هدایت می‌کند.

---

<div align="center">

**[⬆ بازگشت به بالا](#-آشپزخانه-مدرن-modern-kitchen)** · **[🇺🇸 English Version](./README.md)**

</div>

</div>
