import { Router } from "express";
import WeatherLocationController from "../controllers/WeatherLocationController";

const router = Router();

// GET /api/location/city?lat=...&lon=...
router.get("/city", WeatherLocationController.getCityFromCoordinates);

export default router;
