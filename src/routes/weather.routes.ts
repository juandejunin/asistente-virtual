// import { Router } from "express";
// import WeatherController from "../controllers/WeatherController";

// const router = Router();
// const weatherController = new WeatherController();

// // GET /api/weather/today
// router.get("/today", weatherController.getTodayWeather);

// export default router;
  

import { Router } from "express";
import WeatherController from "../controllers/WeatherController";

const router = Router();
const weatherController = new WeatherController();

// GET /api/weather/today → clima solo
router.get("/today", weatherController.getTodayWeather);

// ✅ GET /api/weather/air → calidad del aire solo (opcional)
router.get("/air", weatherController.getAirQuality);

// ✅ GET /api/weather/today-air → clima + calidad del aire juntos
router.get("/today-air", weatherController.getWeatherAndAir);

export default router;
