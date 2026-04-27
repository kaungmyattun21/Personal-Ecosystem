import { Router } from "express";
import { validateBody } from "../../shared/middleware/validate.js";
import { authMiddleware } from "../../shared/middleware/auth.js";
import * as controller from "./controller.js";
import * as schemas from "./schemas.js";

const router = Router();

// Protect all kitchen routes
router.use(authMiddleware);

// --- Grocery Items ---
router.post(
  "/grocery-items",
  validateBody(schemas.createGroceryItemSchema),
  controller.addGroceryItem,
);
router.post(
  "/grocery-items/bulk",
  validateBody(schemas.createMultipleGroceryItemsSchema),
  controller.addMultipleGroceryItems,
);
router.get("/grocery-items", controller.getGroceryItems);
router.get("/grocery-items/:id", controller.getGroceryItem);
router.put(
  "/grocery-items/:id",
  validateBody(schemas.updateGroceryItemSchema),
  controller.updateGroceryItem,
);
router.delete("/grocery-items/:id", controller.removeGroceryItem);

// --- Shopping Lists ---
router.post(
  "/shopping-lists",
  validateBody(schemas.createShoppingListSchema),
  controller.createShoppingList,
);
router.get("/shopping-lists", controller.getShoppingLists);
router.get("/shopping-lists/:id", controller.getShoppingList);
router.put(
  "/shopping-lists/:id",
  validateBody(schemas.updateShoppingListSchema),
  controller.updateShoppingList,
);
router.delete("/shopping-lists/:id", controller.removeShoppingList);

// --- Meal Plans ---
router.post(
  "/meal-plans",
  validateBody(schemas.createMealPlanSchema),
  controller.createMealPlan,
);
router.get("/meal-plans", controller.getMealPlans);
router.get("/meal-plans/:id", controller.getMealPlan);
router.put(
  "/meal-plans/:id",
  validateBody(schemas.updateMealPlanSchema),
  controller.updateMealPlan,
);
router.delete("/meal-plans/:id", controller.removeMealPlan);

export default router;
