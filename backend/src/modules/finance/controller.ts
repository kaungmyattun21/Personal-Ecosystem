import { Response, Request } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as financeService from "./service.js";

// --- Accounts ---
export const createAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.createAccount(req.user!.id, req.body);
    res.status(201).json(result);
  },
);

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.getAccounts(req.user!.id);
  res.json(result);
});

export const getAccountById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getAccount(req.user!.id, req.params.id);
    res.json(result);
  },
);

export const updateAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.updateAccount(
      req.user!.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  },
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.deleteAccount(req.user!.id, req.params.id);
    res.status(204).end();
  },
);

// --- Categories ---
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.createCategory(req.user!.id, req.body);
    res.status(201).json(result);
  },
);

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getCategories(req.user!.id);
    res.json(result);
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getCategory(
      req.user!.id,
      req.params.id,
    );
    res.json(result);
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.updateCategory(
      req.user!.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.deleteCategory(req.user!.id, req.params.id);
    res.status(204).end();
  },
);

// --- Transactions ---
export const createTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.createTransaction(
      req.user!.id,
      req.body,
    );
    res.status(201).json(result);
  },
);

export const getTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getTransactions(req.user!.id, req.query);
    res.json(result);
  },
);

export const getTransactionById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getTransaction(
      req.user!.id,
      req.params.id,
    );
    res.json(result);
  },
);

export const updateTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.updateTransaction(
      req.user!.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  },
);

export const deleteTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.deleteTransaction(req.user!.id, req.params.id);
    res.status(204).end();
  },
);

export const bulkDeleteTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.bulkDeleteTransactions(req.user!.id, req.body.ids);
    res.status(204).end();
  },
);

// --- Budgets ---
export const createBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.createBudget(req.user!.id, req.body);
    res.status(201).json(result);
  },
);

export const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.getBudgets(req.user!.id);
  res.json(result);
});

export const updateBudget = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.updateBudget(
      req.user!.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  },
);

export const deleteBudget = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.deleteBudget(req.user!.id, req.params.id);
    res.status(204).end();
  },
);

// --- Bills ---
export const createBill = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.createBill(req.user!.id, req.body);
  res.status(201).json(result);
});

export const getBills = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.getBills(req.user!.id);
  res.json(result);
});

export const updateBill = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.updateBill(
    req.user!.id,
    req.params.id,
    req.body,
  );
  res.json(result);
});

export const deleteBill = asyncHandler(async (req: Request, res: Response) => {
  await financeService.deleteBill(req.user!.id, req.params.id);
  res.status(204).end();
});

// --- Saving Goals ---
export const createSavingGoal = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.createSavingGoal(
      req.user!.id,
      req.body,
    );
    res.status(201).json(result);
  },
);

export const getSavingGoals = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getSavingGoals(req.user!.id);
    res.json(result);
  },
);

export const getSavingGoalById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getSavingGoal(
      req.user!.id,
      req.params.id,
    );
    res.json(result);
  },
);

export const updateSavingGoal = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.updateSavingGoal(
      req.user!.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  },
);

export const deleteSavingGoal = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.deleteSavingGoal(req.user!.id, req.params.id);
    res.status(204).end();
  },
);

export const createSavingContribution = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.createSavingContribution(
      req.user!.id,
      req.body,
    );
    res.status(201).json(result);
  },
);

export const getSavingContributions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await financeService.getSavingContributions(
      req.user!.id,
      req.params.id,
    );
    res.json(result);
  },
);

export const bulkDeleteBudgets = asyncHandler(
  async (req: Request, res: Response) => {
    await financeService.bulkDeleteBudgets(req.user!.id, req.body.ids);
    res.status(204).end();
  },
);
