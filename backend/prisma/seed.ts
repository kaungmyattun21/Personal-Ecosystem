import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // 1. Find or create a default user
  const email = "test@example.com";
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Note: In a real app, you'd want a passwordHash here if you want to login
    user = await prisma.user.create({
      data: {
        email,
        name: "Test User",
      },
    });
    console.log(`Created test user: ${email}`);
  }

  // 2. Define standard categories
  const categories = [
    // Income
    { name: "Salary", type: "INCOME", color: "#10B981", icon: "Wallet" },
    { name: "Freelance", type: "INCOME", color: "#059669", icon: "Briefcase" },
    {
      name: "Investment",
      type: "INCOME",
      color: "#34D399",
      icon: "TrendingUp",
    },
    { name: "Gifts", type: "INCOME", color: "#6EE7B7", icon: "Gift" },

    // Expense
    { name: "Housing", type: "EXPENSE", color: "#EF4444", icon: "Home" },
    {
      name: "Food & Dining",
      type: "EXPENSE",
      color: "#F87171",
      icon: "Utensils",
    },
    {
      name: "Shopping",
      type: "EXPENSE",
      color: "#F472B6",
      icon: "ShoppingBag",
    },
    { name: "Transportation", type: "EXPENSE", color: "#60A5FA", icon: "Car" },
    { name: "Utilities", type: "EXPENSE", color: "#FB923C", icon: "Zap" },
    { name: "Entertainment", type: "EXPENSE", color: "#A78BFA", icon: "Film" },
    { name: "Health", type: "EXPENSE", color: "#34D399", icon: "Activity" },
    { name: "Education", type: "EXPENSE", color: "#818CF8", icon: "BookOpen" },
    { name: "Travel", type: "EXPENSE", color: "#2DD4BF", icon: "Plane" },
    { name: "Insurance", type: "EXPENSE", color: "#94A3B8", icon: "Shield" },
    {
      name: "Gift & Donation",
      type: "EXPENSE",
      color: "#F472B6",
      icon: "Heart",
    },
    { name: "Misc", type: "EXPENSE", color: "#CBD5E1", icon: "Layers" },
  ];

  console.log("Seeding categories...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        // Since id is cuid and name isn't unique, we might want to check by name + userId
        // But the schema doesn't have a unique constraint on (name, userId)
        // For simplicity in seed, let's just create them if they don't exist by name
        id: "placeholder-id-that-wont-match",
      },
      update: {},
      create: {
        ...cat,
        userId: user.id,
      },
    });
  }

  // Better approach for seed: check by name for this user
  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, userId: user.id },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          ...cat,
          userId: user.id,
        },
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
  }

  console.log("Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
