export type AccountType = "CHECKING" | "SAVINGS" | "CASH" | "CREDIT" | "OTHER";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type BudgetPeriod = "MONTHLY" | "WEEKLY" | "YEARLY";
export type BillFrequency = "ONCE" | "MONTHLY" | "WEEKLY" | "YEARLY";
export type BillStatus = "PAID" | "UNPAID" | "OVERDUE";
export type SavingGoalStatus = "IN_PROGRESS" | "REACHED" | "PAUSED";
export type SavingContributionSource = "INCOME" | "MANUAL" | "TRANSFER";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: string; // Decimal returned as string from API
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string | null;
  amount: string; // Decimal
  type: TransactionType;
  date: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  billId?: string | null;
  budgetId?: string | null;
  savingGoalId?: string | null;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
  bill?: Bill;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  name?: string | null;
  amount: string; // Decimal
  period: BudgetPeriod;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  parentId?: string | null;
  subBudgets?: Budget[];
}

export interface Bill {
  id: string;
  userId: string;
  categoryId?: string | null;
  name: string;
  amount: string; // Decimal
  dueDate: string;
  frequency: BillFrequency;
  status: BillStatus;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  transactions?: Transaction[];
}

export interface SavingGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: string; // Decimal
  currentAmount: string; // Decimal
  targetDate?: string | null;
  color?: string | null;
  icon?: string | null;
  status: SavingGoalStatus;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
  contributions?: SavingContribution[];
}

export interface SavingContribution {
  id: string;
  savingGoalId: string;
  amount: string; // Decimal
  source: SavingContributionSource;
  description?: string | null;
  date: string;
  createdAt: string;
}

export interface TransactionFilterParams {
  search?: string;
  type?: string;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
}
