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

export default router;
