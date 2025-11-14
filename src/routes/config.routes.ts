// src/routes/config.routes.ts
import { Router, Request, Response } from "express";
import ConfigController from "../controllers/ConfigController";
import citiesRoutes from "./cities.routes";
import WeatherLocationRoutes from "./WeatherLocationRoutes";
import standingsRoutes from "./standings.routes";  // ← NUEVA

const router = Router();
const controller = new ConfigController();

// Endpoints originales
router.get("/", controller.getConfig);
router.post("/", controller.updateConfig);
router.use("/cities", citiesRoutes);
router.use("/location", WeatherLocationRoutes);

// ← NUEVA RUTA
router.use("/standings", standingsRoutes);  // → /api/config/standings/PL

// Endpoint de prueba
router.get("/test", (req: Request, res: Response) => {
  res.json({
    message: "ConfigRoutes está activo",
    timestamp: new Date().toISOString()
  });
});

export default router;