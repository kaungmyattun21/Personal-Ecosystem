export type GroceryItemStatus = "AVAILABLE" | "CONSUMED" | "EXPIRED" | "LOW_STOCK";
export type ShoppingListStatus = "ACTIVE" | "ARCHIVED";
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
export type MealPlanStatus = "ACTIVE" | "ARCHIVED";

export interface GroceryItem {
  id: string;
  userId: string;
  name: string;
  category: string | null;
  quantity: number;
  price: string; // Decimal is often returned as string
  unit: string | null;
  image: string | null;
  expiryDate: string | null;
  status: GroceryItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  shoppingListId: string;
  groceryItemId: string | null;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  image: string | null;
  notes: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  estimatedCost: string;
  status: ShoppingListStatus;
  createdAt: string;
  updatedAt: string;
  items?: ShoppingListItem[];
}

export interface MealIngredient {
  name: string;
  quantity: number;
  unit?: string | null;
}

export interface Meal {
  id: string;
  mealPlanId: string;
  date: string;
  type: MealType;
  name: string;
  notes: string | null;
  ingredients: MealIngredient[] | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: MealPlanStatus;
  createdAt: string;
  updatedAt: string;
  meals?: Meal[];
}

// Input Types for Creation/Update

export interface CreateGroceryItemInput {
  name: string;
  category?: string | null;
  quantity?: number;
  unit?: string | null;
  image?: string | null;
  expiryDate?: string | null;
  status?: GroceryItemStatus;
}

export interface UpdateGroceryItemInput extends Partial<CreateGroceryItemInput> {}

export interface CreateShoppingListItemInput {
  groceryItemId?: string | null;
  name: string;
  quantity?: number;
  unit?: string | null;
  category?: string | null;
  image?: string | null;
  notes?: string | null;
}

export interface CreateShoppingListInput {
  name: string;
  status?: ShoppingListStatus;
  items?: CreateShoppingListItemInput[];
}

export interface UpdateShoppingListItemInput extends Partial<CreateShoppingListItemInput> {
  id?: string;
  isCompleted?: boolean;
}

export interface UpdateShoppingListInput {
  name?: string;
  status?: ShoppingListStatus;
  items?: UpdateShoppingListItemInput[];
}

export interface CreateMealInput {
  date: string;
  type: MealType;
  name: string;
  notes?: string | null;
  ingredients?: MealIngredient[] | null;
}

export interface CreateMealPlanInput {
  startDate: string;
  endDate: string;
  status?: MealPlanStatus;
  meals?: CreateMealInput[];
}

export interface UpdateMealInput extends Partial<CreateMealInput> {
  id?: string;
  isCompleted?: boolean;
}

export interface UpdateMealPlanInput {
  startDate?: string;
  endDate?: string;
  status?: MealPlanStatus;
  meals?: UpdateMealInput[];
}
