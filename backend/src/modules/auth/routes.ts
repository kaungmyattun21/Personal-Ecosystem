import { Router } from "express";
import { validateBody } from "../../shared/middleware/validate.js";
import { authMiddleware } from "../../shared/middleware/auth.js";
import * as controller from "./controller.js";
import * as schemas from "./schemas.js";

const router = Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  controller.register,
);
router.post("/login", validateBody(schemas.loginSchema), controller.login);
router.post("/oauth", validateBody(schemas.oauthSchema), controller.oauthLogin);
router.post(
  "/refresh",
  validateBody(schemas.refreshSchema),
  controller.refresh,
);

router.post("/logout", authMiddleware, controller.logout);

router.get("/me", authMiddleware, controller.getMe);

export default router;
