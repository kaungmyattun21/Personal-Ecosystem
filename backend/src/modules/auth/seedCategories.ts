import { prisma } from "../../shared/db.js";

const DEFAULT_CATEGORIES = [
  // Income
  { name: "Salary", type: "INCOME", color: "#10B981", icon: "Wallet" },
  { name: "Freelance", type: "INCOME", color: "#059669", icon: "Briefcase" },
  { name: "Investment", type: "INCOME", color: "#34D399", icon: "TrendingUp" },
  { name: "Gifts", type: "INCOME", color: "#6EE7B7", icon: "Gift" },

  // Expense
  { name: "Housing", type: "EXPENSE", color: "#EF4444", icon: "Home" },
  { name: "Food & Dining", type: "EXPENSE", color: "#F87171", icon: "Utensils" },
  { name: "Shopping", type: "EXPENSE", color: "#F472B6", icon: "ShoppingBag" },
  { name: "Transportation", type: "EXPENSE", color: "#60A5FA", icon: "Car" },
  { name: "Utilities", type: "EXPENSE", color: "#FB923C", icon: "Zap" },
  { name: "Entertainment", type: "EXPENSE", color: "#A78BFA", icon: "Film" },
  { name: "Health", type: "EXPENSE", color: "#34D399", icon: "Activity" },
  { name: "Education", type: "EXPENSE", color: "#818CF8", icon: "BookOpen" },
  { name: "Travel", type: "EXPENSE", color: "#2DD4BF", icon: "Plane" },
  { name: "Insurance", type: "EXPENSE", color: "#94A3B8", icon: "Shield" },
  { name: "Gift & Donation", type: "EXPENSE", color: "#F472B6", icon: "Heart" },
  { name: "Misc", type: "EXPENSE", color: "#CBD5E1", icon: "Layers" },
];

export async function seedDefaultCategories(userId: string) {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId })),
  });
}
