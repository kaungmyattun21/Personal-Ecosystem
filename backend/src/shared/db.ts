import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js"; // Assuming this validates your env vars

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 1. Prisma 7 now takes a config object directly, no Pool required!
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// 2. Instantiate the client with the adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
