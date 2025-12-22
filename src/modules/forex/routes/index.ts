import { Router } from "express";
import {forexRoutes } from "./forex.routes";
import {forexHistoryRoutes} from "./forexHistory.routes";

const router = Router();

// Precios actuales (API / cache)
router.use(forexRoutes);

// Histórico (BBDD / velas)
router.use(forexHistoryRoutes);

export default router;
