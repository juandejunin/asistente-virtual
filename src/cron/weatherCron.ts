import cron from "node-cron";
import { sendWeatherUpdate } from "../services/WeatherNotifier";
import { logger } from "../utils/logger";

// Ejecutar todos los días a las 8:00 AM
cron.schedule("* * * * *", async () => {
  logger.info("⏰ Enviando actualización del clima cada minuto...");
  await sendWeatherUpdate();
});
