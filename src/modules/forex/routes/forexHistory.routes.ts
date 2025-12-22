import { Router } from "express";
import { ForexHistoryController } from "../controllers/ForexHistoryController";

export const forexHistoryRoutes = Router();

// Históricos OHLC (para velas)
forexHistoryRoutes.get(
  "/history/:currency",
  ForexHistoryController.getHistory
);

// Tendencia diaria (flecha verde/roja)
forexHistoryRoutes.get(
  "/trend/:currency",
  ForexHistoryController.getTrend
);
