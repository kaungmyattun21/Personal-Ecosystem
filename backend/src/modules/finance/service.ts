import * as repo from "./repository.js";
import { AppError } from "../../shared/utils/AppError.js";
import { seedDefaultCategories } from "../auth/seedCategories.js";
import { TransactionFilterParams } from "./types.js";
import { buildTransactionQuery } from "./utils/transactionFilters.js";

// --- Accounts ---
export async function createAccount(userId: string, data: any) {
  return repo.createAccount(userId, data);
}

export async function getAccounts(userId: string) {
  return repo.findAccountsByUserId(userId);
}

export async function getAccount(userId: string, accountId: string) {
  const account = await repo.findAccountById(accountId, userId);
  if (!account) {
    throw new AppError("Account not found", 404);
  }
  return account;
}

export async function updateAccount(
  userId: string,
  accountId: string,
  data: any,
) {
  await getAccount(userId, accountId); // Verify ownership/existence
  return repo.updateAccount(accountId, data);
}

export async function deleteAccount(userId: string, accountId: string) {
  await getAccount(userId, accountId); // Verify ownership/existence
  return repo.deleteAccount(accountId);
}

// --- Categories ---
export async function createCategory(userId: string, data: any) {
  return repo.createCategory(userId, data);
}

export async function getCategories(userId: string) {
  const categories = await repo.findCategoriesByUserId(userId);
  if (categories.length === 0) {
    await seedDefaultCategories(userId);
    return repo.findCategoriesByUserId(userId);
  }
  return categories;
}

export async function getCategory(userId: string, categoryId: string) {
  const category = await repo.findCategoryById(categoryId, userId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  data: any,
) {
  await getCategory(userId, categoryId); // Verify ownership/existence
  return repo.updateCategory(categoryId, data);
}

export async function deleteCategory(userId: string, categoryId: string) {
  await getCategory(userId, categoryId); // Verify ownership/existence
  return repo.deleteCategory(categoryId);
}

// --- Transactions ---
export async function createTransaction(userId: string, data: any) {
  return repo.runInTransaction(async (tx) => {
    let accountId = data.accountId;

    if (!accountId) {
      const accounts = await repo.findAccountsByUserId(userId, tx);

      if (accounts.length > 0) {
        accountId = accounts[0].id;
      } else {
        const defaultAccount = await repo.createAccount(userId, {
          name: "Cash",
          type: "CASH",
          balance: 0,
          currency: "USD",
        }, tx);
        accountId = defaultAccount.id;
      }
    }

    // Auto-link budget if unassigned and expense matches a unique budget for the category
    let budgetId = data.budgetId;
    if (data.type === "EXPENSE" && !budgetId && data.categoryId) {
      const matchedBudgets = await repo.findBudgets({
        userId,
        categoryId: data.categoryId,
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      }, tx);

      if (matchedBudgets.length === 1) {
        budgetId = matchedBudgets[0].id;
      }
    }

    const transaction = await repo.createTransaction(userId, {
      ...data,
      accountId,
      budgetId,
      date: data.date ? new Date(data.date) : new Date(),
    }, tx);

    const amountValue = Number(data.amount);
    let balanceChange = amountValue;
    if (data.type === "EXPENSE" || data.type === "TRANSFER") {
      balanceChange = -amountValue;
    }

    // Update Account Balance
    await repo.updateAccount(accountId, {
      balance: {
        increment: balanceChange,
      },
    }, tx);

    // Update Budget Spent Balance (only for Expenses)
    if (budgetId && data.type === "EXPENSE") {
      await repo.updateBudget(budgetId, {
        spent: {
          increment: amountValue,
        },
      }, tx);
    }

    if (data.billId) {
      await repo.updateBill(data.billId, { status: "PAID" }, tx);
    }

    return transaction;
  });
}

export async function getTransactions(
  userId: string,
  searchParams: TransactionFilterParams = {},
) {
  const queryConditions = buildTransactionQuery(searchParams);
  return repo.findTransactionsByUserId(userId, queryConditions);
}

export async function getTransaction(userId: string, transactionId: string) {
  const transaction = await repo.findTransactionById(transactionId, userId);
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }
  return transaction;
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: any,
) {
  return repo.runInTransaction(async (tx) => {
    const existing = await repo.findTransactionById(transactionId, userId, tx);

    if (!existing) {
      throw new AppError("Transaction not found", 404);
    }

    const updateData = { ...data };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const transaction = await repo.updateTransaction(transactionId, { ...updateData, userId }, tx);

    // --- Balance Calculation Variables ---
    const oldAmount = Number(existing.amount);
    const newAmount = data.amount !== undefined ? Number(data.amount) : oldAmount;
    const oldType = existing.type;
    const newType = data.type !== undefined ? data.type : oldType;
    const amountChanged = newAmount !== oldAmount;
    const typeChanged = newType !== oldType;

    // Handle Account Balance updates
    const oldAccountId = existing.accountId;
    const newAccountId = data.accountId !== undefined ? data.accountId : oldAccountId;

    const getBalanceImpact = (type: string, amount: number) => {
      return type === "INCOME" ? amount : -amount;
    };

    if (oldAccountId === newAccountId) {
      const oldImpact = getBalanceImpact(oldType, oldAmount);
      const newImpact = getBalanceImpact(newType, newAmount);
      const diff = newImpact - oldImpact;

      if (diff !== 0) {
        await repo.updateAccount(oldAccountId, { balance: { increment: diff } }, tx);
      }
    } else {
      const oldImpact = getBalanceImpact(oldType, oldAmount);
      const newImpact = getBalanceImpact(newType, newAmount);

      await repo.updateAccount(oldAccountId, { balance: { decrement: oldImpact } }, tx);
      await repo.updateAccount(newAccountId, { balance: { increment: newImpact } }, tx);
    }

    // Handle Budget Spent Balance updates
    const oldBudgetId = existing.budgetId;
    const newBudgetId = data.budgetId !== undefined ? data.budgetId : oldBudgetId;

    if (oldBudgetId === newBudgetId) {
      if (oldBudgetId && (amountChanged || typeChanged)) {
        const oldImpact = oldType === "EXPENSE" ? oldAmount : 0;
        const newImpact = newType === "EXPENSE" ? newAmount : 0;
        const diff = newImpact - oldImpact;
        if (diff !== 0) {
          await repo.updateBudget(oldBudgetId, { spent: { increment: diff } }, tx);
        }
      }
    } else {
      if (oldBudgetId && oldType === "EXPENSE") {
        await repo.updateBudget(oldBudgetId, { spent: { decrement: oldAmount } }, tx);
      }
      if (newBudgetId && newType === "EXPENSE") {
        await repo.updateBudget(newBudgetId, { spent: { increment: newAmount } }, tx);
      }
    }

    if (data.billId !== undefined && data.billId !== existing.billId) {
      if (data.billId) {
        await repo.updateBill(data.billId, { status: "PAID" }, tx);
      }
    }

    return transaction;
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  return repo.runInTransaction(async (tx) => {
    const existing = await repo.findTransactionById(transactionId, userId, tx);
    if (!existing) {
      throw new AppError("Transaction not found", 404);
    }

    // Delete transaction and save the result to return later
    const deletedTransaction = await repo.deleteTransaction(transactionId, tx);

    // Another approach: Recalculate balance from all remaining transactions to avoid delta drift/sign issues
    const remainingTransactions = await repo.findTransactions({ accountId: existing.accountId }, tx);

    const newBalance = remainingTransactions.reduce((acc: number, t: any) => {
      const amt = Number(t.amount);
      return t.type === "INCOME" ? acc + amt : acc - amt;
    }, 0);

    await repo.updateAccount(existing.accountId, { balance: newBalance }, tx);

    // Recalculate budget balance if transaction was linked to one
    if (existing.budgetId) {
      const budgetTransactions = await repo.findTransactions({ budgetId: existing.budgetId, type: "EXPENSE" }, tx);
      const newSpent = budgetTransactions.reduce(
        (acc: number, t: any) => acc + Number(t.amount),
        0,
      );
      await repo.updateBudget(existing.budgetId, { spent: newSpent }, tx);
    }

    return deletedTransaction;
  });
}

export async function bulkDeleteTransactions(
  userId: string,
  transactionIds: string[],
) {
  return repo.runInTransaction(async (tx) => {
    // 1. Get transactions to identify affected entities (accounts, budgets, goals)
    const affectedTxs = await repo.findTransactions({ id: { in: transactionIds }, userId }, tx);

    if (affectedTxs.length === 0) return;

    const accountIds = Array.from(
      new Set(affectedTxs.map((t: any) => t.accountId)),
    );
    const budgetIds = Array.from(
      new Set(
        affectedTxs
          .filter((t: any) => t.budgetId)
          .map((t: any) => t.budgetId as string),
      ),
    );

    // 2. Perform bulk deletion
    await repo.deleteTransactions({ id: { in: transactionIds }, userId }, tx);

    // 3. Re-calculate Account Balances
    for (const accountId of accountIds as string[]) {
      const remainingTxs = await repo.findTransactions({ accountId }, tx);
      const newBalance = remainingTxs.reduce((acc: number, t: any) => {
        const amt = Number(t.amount);
        return t.type === "INCOME" ? acc + amt : acc - amt;
      }, 0);
      await repo.updateAccount(accountId, { balance: newBalance }, tx);
    }

    // 4. Re-calculate Budget Spent
    for (const budgetId of budgetIds as string[]) {
      const budgetTxs = await repo.findTransactions({ budgetId, type: "EXPENSE" }, tx);
      const newSpent = budgetTxs.reduce(
        (acc: number, t: any) => acc + Number(t.amount),
        0,
      );
      await repo.updateBudget(budgetId, { spent: newSpent }, tx);
    }
  });
}

// --- Budgets ---
export async function createBudget(userId: string, data: any) {
  if (data.parentId) {
    const parent = await repo.findBudgetById(data.parentId, userId);
    if (!parent) {
      throw new AppError("Parent budget not found", 404);
    }

    const siblingBudgets = await repo.findBudgetsByParentId(userId, data.parentId);
    const sumOfSiblingLimits = siblingBudgets.reduce(
      (aggregateAmount: number, sibling: any) =>
        aggregateAmount + Number(sibling.amount),
      0,
    );
    const proposedBudgetLimit = Number(data.amount);
    const absoluteParentLimit = Number(parent.amount);

    if (sumOfSiblingLimits + proposedBudgetLimit > absoluteParentLimit) {
      throw new AppError(
        "Sub-budgets total limits cannot exceed parent budget limit",
        400,
      );
    }
  }

  return repo.createBudget(userId, {
    ...data,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : null,
  });
}

export async function getBudgets(userId: string) {
  const budgets = await repo.findBudgetsByUserId(userId);

  const populateActual = (b: any): any => {
    const directActual = Number(b.spent) || 0;

    let subBudgetsActual = 0;
    let populatedSubBudgets;

    if (b.subBudgets && b.subBudgets.length > 0) {
      populatedSubBudgets = b.subBudgets.map((sub: any) => {
        const pSub = populateActual(sub);
        subBudgetsActual += pSub.actual;
        return pSub;
      });
    }

    return {
      ...b,
      subBudgets: populatedSubBudgets,
      actual: directActual + subBudgetsActual,
    };
  };

  return budgets.map(populateActual);
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  data: any,
) {
  const existing = await repo.findBudgetById(budgetId, userId);
  if (!existing) {
    throw new AppError("Budget not found", 404);
  }

  let finalParentId = existing.parentId;

  if (data.parentId !== undefined && data.parentId !== existing.parentId) {
    if (data.parentId === budgetId) {
      throw new AppError("A budget cannot be its own parent", 400);
    }
    if (data.parentId) {
      const parent = await repo.findBudgetById(data.parentId, userId);
      if (!parent) {
        throw new AppError("Parent budget not found", 404);
      }
    }
    finalParentId = data.parentId;
  }

  if (finalParentId) {
    const parent = await repo.findBudgetById(finalParentId, userId);
    if (parent) {
      const siblingBudgets = await repo.findBudgetsByParentId(userId, finalParentId);
      const sumOfOtherSiblingLimits = (siblingBudgets as any[])
        .filter((sibling: any) => sibling.id !== budgetId)
        .reduce(
          (aggregateAmount: number, sibling: any) =>
            aggregateAmount + Number(sibling.amount),
          0,
        );

      const requestedBudgetLimit = Number(
        data.amount !== undefined ? data.amount : existing.amount,
      );
      const maximumAllowedByParent = Number(parent.amount);

      if (
        sumOfOtherSiblingLimits + requestedBudgetLimit >
        maximumAllowedByParent
      ) {
        throw new AppError(
          "Sub-budgets total limits cannot exceed parent budget limit",
          400,
        );
      }
    }
  }

  const proposedParentBudgetLimit = Number(
    data.amount !== undefined ? data.amount : existing.amount,
  );
  const childBudgets = await repo.findBudgetsByParentId(userId, budgetId);
  const sumOfChildBudgetLimits = childBudgets.reduce(
    (aggregateAmount: number, child: any) =>
      aggregateAmount + Number(child.amount),
    0,
  );

  if (sumOfChildBudgetLimits > proposedParentBudgetLimit) {
    throw new AppError(
      "Budget limit cannot be less than the sum of its sub-budgets",
      400,
    );
  }

  const updateData = { ...data };
  if (updateData.startDate)
    updateData.startDate = new Date(updateData.startDate);
  if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

  return repo.updateBudget(budgetId, updateData);
}

export async function deleteBudget(userId: string, budgetId: string) {
  const existing = await repo.findBudgetById(budgetId, userId);
  if (!existing) {
    throw new AppError("Budget not found", 404);
  }
  return repo.deleteBudget(budgetId);
}

// --- Bills ---
export async function createBill(userId: string, data: any) {
  return repo.createBill(userId, {
    ...data,
    dueDate: new Date(data.dueDate),
  });
}

export async function getBills(userId: string) {
  return repo.findBillsByUserId(userId);
}

export async function updateBill(userId: string, billId: string, data: any) {
  const existing = await repo.findBillById(billId, userId);
  if (!existing) {
    throw new AppError("Bill not found", 404);
  }

  const updateData = { ...data };
  if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);

  return repo.updateBill(billId, updateData);
}

export async function deleteBill(userId: string, billId: string) {
  const existing = await repo.findBillById(billId, userId);
  if (!existing) {
    throw new AppError("Bill not found", 404);
  }
  return repo.deleteBill(billId);
}

// --- Saving Goals ---
export async function createSavingGoal(userId: string, data: any) {
  return repo.createSavingGoal(userId, data);
}

export async function getSavingGoals(userId: string) {
  return repo.findSavingGoalsByUserId(userId);
}

export async function getSavingGoal(userId: string, goalId: string) {
  const goal = await repo.findSavingGoalById(goalId, userId);
  if (!goal) {
    throw new AppError("Saving goal not found", 404);
  }
  return goal;
}

export async function updateSavingGoal(
  userId: string,
  goalId: string,
  data: any,
) {
  await getSavingGoal(userId, goalId);
  return repo.updateSavingGoal(goalId, data);
}

export async function deleteSavingGoal(userId: string, goalId: string) {
  await getSavingGoal(userId, goalId);
  return repo.deleteSavingGoal(goalId);
}

// --- Saving Contributions ---
export async function createSavingContribution(userId: string, data: any) {
  return repo.runInTransaction(async (tx) => {
    const goal = await repo.findSavingGoalById(data.savingGoalId, userId, tx);
    if (!goal) {
      throw new AppError("Saving goal not found", 404);
    }

    const contribution = await repo.createSavingContribution({
      ...data,
      date: data.date ? new Date(data.date) : new Date(),
    }, tx);

    const amountValue = Number(data.amount);
    const newCurrentAmount = Number(goal.currentAmount) + amountValue;
    const reached = newCurrentAmount >= Number(goal.targetAmount);

    await repo.updateSavingGoal(data.savingGoalId, {
      currentAmount: newCurrentAmount,
      status: reached ? "REACHED" : goal.status,
    }, tx);

    return contribution;
  });
}

export async function getSavingContributions(userId: string, goalId: string) {
  const goal = await repo.findSavingGoalById(goalId, userId);
  if (!goal) {
    throw new AppError("Saving goal not found", 404);
  }
  return repo.findSavingContributionsByGoalId(goalId);
}

export async function bulkDeleteBudgets(userId: string, ids: string[]) {
  return repo.runInTransaction(async (tx) => {
    await repo.deleteBudgets({ id: { in: ids }, userId }, tx);
  });
}
