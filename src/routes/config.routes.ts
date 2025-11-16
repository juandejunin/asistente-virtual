// src/routes/config.routes.ts
import { Router, Request, Response } from "express";
import ConfigController from "../controllers/ConfigController";
import citiesRoutes from "./cities.routes";
import WeatherLocationRoutes from "./WeatherLocationRoutes";
import standingsRoutes from "./standings.routes";
import scorersRoutes from "./scorers.routes"; // ← NUEVA

const router = Router();
const controller = new ConfigController();

// Endpoints originales
router.get("/", controller.getConfig);
router.post("/", controller.updateConfig);
router.use("/cities", citiesRoutes);
router.use("/location", WeatherLocationRoutes);

// RUTAS DE FÚTBOL
router.use("/standings", standingsRoutes);   // /api/config/standings/PL
router.use("/", scorersRoutes);             // ← NUEVA: /api/config/scorers/PD, /cards/yellow/PD, etc.

export default router;