<div align="center">

# 🍳 Modern Kitchen (آشپزخانه مدرن)

**A Full-Stack, Luxury Kitchenware & Culinary Equipment E-Commerce Platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

### 🌐 Multi-Language Support

[![English](<https://img.shields.io/badge/Language-English_(Active)-f09267?style=for-the-badge>)](./README.md)
[![Persian](<https://img.shields.io/badge/زبان-فارسی_(Persian)-1e293b?style=for-the-badge>)](./README.fa.md)

**Available Languages:**  
[**English**](./README.md) | [**فارسی (Persian)**](./README.fa.md)

</div>

---

## 📖 Overview

**Modern Kitchen (آشپزخانه مدرن)** is a full-stack, RTL-ready e-commerce web application built for showcasing and selling premium kitchenware, cookware, dining sets, and culinary appliances. It combines a sleek dark-glassmorphism storefront in **React 19 + Tailwind CSS v4** with an **Express.js + Prisma (PostgreSQL)** backend—complete with an automatic in-memory fallback store so you can run and test the application immediately with or without a database.

---

## ✨ Key Features

- **🔐 Dual-Mode Authentication + 4-Digit SMS OTP**
  - Clean **Login** and **Register** flows enhanced with 4-digit SMS verification codes (`/api/auth/send-otp` & `/api/auth/verify-otp`).
  - Supports **Kavenegar**, **IPPanel / FarazSMS**, **MeliPayamak**, or instant development fallback mode.
  - **Auth Interceptor Modal (`AuthRequiredModal`)**: Prompts unauthenticated users to sign in or quickly register when adding items to their cart or wishlist.
- **🔍 Live Smart Search & Suggestions**
  - Real-time dropdown suggestions with product thumbnails, brand tags, and formatted Toman pricing.
  - **Smart Mobile UX**: Prevents unwanted auto-scroll jumping on mobile screens while typing; scrolls smoothly only when a product is selected or valid results exist, and displays a clear _"No products found"_ state otherwise.
- **🧭 Responsive RTL Header & Navigation**
  - Pinned brand identity on the right, account & cart controls on the left, adaptive search input (full bar on desktop, expandable icon on mobile), and mobile drawer menu.
- **🛒 Persistent Cart, Wishlist & Checkout**
  - Interactive slide-over Cart and Wishlist drawers, quantity controls, color selection, and order tracking code generation.
- **📦 Full-Stack Backend with Zero-Config Fallback**
  - RESTful Express API powered by **Prisma ORM + PostgreSQL (Neon compatible)**, seamlessly falling back to an in-memory store when `DATABASE_URL` is not provided.
- **☁️ One-Click Vercel Serverless Ready**
  - Pre-configured with `vercel.json` and `/api/index.ts` to deploy both the Vite frontend and Express API routes seamlessly on Vercel.

---

## 🛠️ Tech Stack

| Layer              | Technologies                                                            |
| :----------------- | :---------------------------------------------------------------------- |
| **Frontend**       | React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Lucide React, Motion |
| **Backend**        | Node.js, Express.js 4, REST API                                         |
| **Database & ORM** | Prisma 6, PostgreSQL (Neon / Cloud SQL) + In-Memory Store Fallback      |
| **SMS & AI**       | Kavenegar / IPPanel / MeliPayamak OTP, `@google/genai`                  |
| **Deployment**     | Vercel (Static Build + Serverless Functions)                            |

---

## 📂 Project Structure

```text
├── api/
│   └── index.ts                 # Vercel Serverless entry point wrapping Express app
├── prisma/
│   ├── schema.prisma            # PostgreSQL database models (User, Product, Order, etc.)
│   └── seed.ts                  # Initial database seed script
├── server/
│   ├── app.ts                   # Express app setup, CORS & API router mounting
│   ├── index.ts                 # Local Node/Vite dev & production server
│   ├── routes/                  # Modular API endpoints (auth, products, cart, orders, ...)
│   ├── services/                # SMS OTP & business services
│   └── store/                   # In-memory fallback store
├── src/
│   ├── components/              # UI components (Header, Hero, AuthRequiredModal, Drawers, ...)
│   ├── data/                    # Static catalog & seed helpers
│   ├── lib/                     # Formatters (Persian digits/Toman) & Prisma client
│   ├── App.tsx                  # Root application state & views
│   └── types.ts                 # Shared TypeScript interfaces
├── server.ts                    # Entry point for dev & bundled server
├── vercel.json                  # Vercel API rewrite configuration
└── package.json                 # Scripts & dependencies
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/modern-kitchen.git
cd modern-kitchen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials (optional for local testing thanks to in-memory fallback):

```bash
cp .env.example .env
```

| Variable                            | Description                                          | Required                                      |
| :---------------------------------- | :--------------------------------------------------- | :-------------------------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string (e.g., Neon pooled URL) | Optional (uses in-memory fallback if omitted) |
| `DIRECT_URL`                        | Direct PostgreSQL URL for Prisma migrations          | Optional                                      |
| `GEMINI_API_KEY`                    | Google Gemini API key for server-side AI features    | Optional                                      |
| `SMS_PROVIDER`                      | `kavenegar`, `ippanel`, or `melipayamak`             | Optional (uses dev OTP preview if omitted)    |
| `KAVENEGAR_API_KEY` / `SMS_API_KEY` | API key for your SMS provider                        | Optional                                      |

### 4. Setup Database (Optional)

If using PostgreSQL:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at **`http://localhost:3000`**.

---

## 📜 Available Scripts

| Command                 | Description                                                         |
| :---------------------- | :------------------------------------------------------------------ |
| `npm run dev`           | Start full-stack Vite + Express development server on port `3000`   |
| `npm run build`         | Build client bundle (`dist/`) and bundle server (`dist/server.cjs`) |
| `npm start`             | Run production Node.js server                                       |
| `npm run lint`          | Run TypeScript type checking (`tsc --noEmit`)                       |
| `npm run prisma:studio` | Open Prisma visual database browser                                 |

---

## 🌐 Deploying to Vercel

This repository is already configured for **Vercel**:

1. Push your code to **GitHub**.
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import your GitHub repository.
4. Keep the default **Vite** preset (`Build Command: npm run build`, `Output Directory: dist`).
5. Add your environment variables (`DATABASE_URL`, `SMS_API_KEY`, etc.) in **Project Settings → Environment Variables** if needed.
6. Click **Deploy** — `vercel.json` automatically routes `/api/*` requests to `/api/index.ts`.

---

<div align="center">

**[⬆ Back to Top](#-modern-kitchen-آشپزخانه-مدرن)** · **[🇮🇷 نسخه فارسی](./README.fa.md)**

</div>
