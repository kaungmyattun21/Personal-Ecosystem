import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes.js";
import financeRoutes from "./modules/finance/routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);

app.use(errorHandler);

export default app;
