import { Router } from "express";
import { validateBody } from "../../shared/middleware/validate.js";
import { authMiddleware } from "../../shared/middleware/auth.js";
import * as controller from "./controller.js";
import * as schemas from "./schemas.js";

const router = Router();

// Protect all finance routes
router.use(authMiddleware);

// --- Accounts ---
router.post(
  "/accounts",
  validateBody(schemas.createAccountSchema),
  controller.createAccount,
);
router.get("/accounts", controller.getAccounts);
router.get("/accounts/:id", controller.getAccountById);
router.put(
  "/accounts/:id",
  validateBody(schemas.updateAccountSchema),
  controller.updateAccount,
);
router.delete("/accounts/:id", controller.deleteAccount);

// --- Categories ---
router.post(
  "/categories",
  validateBody(schemas.createCategorySchema),
  controller.createCategory,
);
router.get("/categories", controller.getCategories);
router.get("/categories/:id", controller.getCategoryById);
router.put(
  "/categories/:id",
  validateBody(schemas.updateCategorySchema),
  controller.updateCategory,
);
router.delete("/categories/:id", controller.deleteCategory);

// --- Transactions ---
router.post(
  "/transactions",
  validateBody(schemas.createTransactionSchema),
  controller.createTransaction,
);
router.get("/transactions", controller.getTransactions);
router.get("/transactions/:id", controller.getTransactionById);
router.put(
  "/transactions/:id",
  validateBody(schemas.updateTransactionSchema),
  controller.updateTransaction,
);
router.delete("/transactions/:id", controller.deleteTransaction);
router.post(
  "/transactions/bulk-delete",
  validateBody(schemas.bulkDeleteSchema),
  controller.bulkDeleteTransactions,
);

// --- Budgets ---
router.post(
  "/budgets",
  validateBody(schemas.createBudgetSchema),
  controller.createBudget,
);
router.get("/budgets", controller.getBudgets);
router.put(
  "/budgets/:id",
  validateBody(schemas.updateBudgetSchema),
  controller.updateBudget,
);
router.delete("/budgets/:id", controller.deleteBudget);
router.post(
  "/budgets/bulk-delete",
  validateBody(schemas.bulkDeleteSchema),
  controller.bulkDeleteBudgets,
);

// --- Bills ---
router.post(
  "/bills",
  validateBody(schemas.createBillSchema),
  controller.createBill,
);
router.get("/bills", controller.getBills);
router.put(
  "/bills/:id",
  validateBody(schemas.updateBillSchema),
  controller.updateBill,
);
router.delete("/bills/:id", controller.deleteBill);

// --- Saving Goals ---
router.post(
  "/goals",
  validateBody(schemas.createSavingGoalSchema),
  controller.createSavingGoal,
);
router.get("/goals", controller.getSavingGoals);
router.get("/goals/:id", controller.getSavingGoalById);
router.put(
  "/goals/:id",
  validateBody(schemas.updateSavingGoalSchema),
  controller.updateSavingGoal,
);
router.delete("/goals/:id", controller.deleteSavingGoal);
router.post(
  "/goals/contributions",
  validateBody(schemas.createSavingContributionSchema),
  controller.createSavingContribution,
);
router.get("/goals/:id/contributions", controller.getSavingContributions);

export default router;
