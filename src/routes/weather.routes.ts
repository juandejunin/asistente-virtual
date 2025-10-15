import { Router } from "express";
import WeatherController from "../controllers/WeatherController";

const router = Router();
const weatherController = new WeatherController();

// GET /api/weather/today
router.get("/today", weatherController.getTodayWeather);

export default router;
