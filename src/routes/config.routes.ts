// src/routes/config.routes.ts
import { Router } from "express";
import ConfigController from "../controllers/ConfigController";
import citiesRoutes from "./cities.routes";
import WeatherLocationRoutes from "./WeatherLocationRoutes";
import standingsRoutes from "./standings.routes";
import scorersRoutes from "./scorers.routes";
import contactoRoutes from "./contacto.routes";

const router = Router();
const controller = new ConfigController();

// Endpoints originales
router.get("/", controller.getConfig);
router.post("/", controller.updateConfig);
router.use("/cities", citiesRoutes);
router.use("/location", WeatherLocationRoutes);

// RUTAS DE FÚTBOL
router.use("/standings", standingsRoutes);
router.use("/", scorersRoutes);

router.use("/contacto", contactoRoutes);

export default router;
