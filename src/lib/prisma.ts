import { PrismaClient } from "@prisma/client";

// Determine if a real, valid PostgreSQL connection URL is provided
export const isDatabaseConfigured: boolean = Boolean(
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.startsWith("postgresql://") ||
    process.env.DATABASE_URL.startsWith("postgres://")) &&
  !process.env.DATABASE_URL.includes("ep-sample-pool") &&
  !process.env.DATABASE_URL.includes("neon_user") &&
  !process.env.DATABASE_URL.includes("user:password"),
);

// Fallback dummy connection string (only used to satisfy Prisma client instantiation)
const databaseUrl = isDatabaseConfigured
  ? process.env.DATABASE_URL!
  : "postgresql://neon_user:neon_password@localhost:5432/neondb?sslmode=disable";

// Global singleton instance for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Do not log error directly to stderr; handle errors gracefully in try/catch blocks
    log: [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
