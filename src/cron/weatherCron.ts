// import cron from "node-cron";
// import { sendWeatherUpdate } from "../services/WeatherNotifier";
// import { logger } from "../utils/logger";

// // Ejecutar todos los días a las 8:00 AM
// cron.schedule("* * * * *", async () => {
//   logger.info("⏰ Enviando actualización del clima cada minuto...");
//   await sendWeatherUpdate();
// });

import cron, { ScheduledTask } from "node-cron";
import { sendWeatherUpdate } from "../services/WeatherNotifier";
import { logger } from "../utils/logger";
import ConfigService from "../services/ConfigService";

let currentTask: ScheduledTask | null = null;

export function startWeatherCron() {
  const { cronSchedule } = ConfigService.getConfig();
  currentTask = cron.schedule(cronSchedule, async () => {
    logger.info("⏰ Ejecutando tarea de envío de clima...");
    await sendWeatherUpdate();
  });
  logger.info(`🕐 Cron iniciado con frecuencia: ${cronSchedule}`);
}

export function restartWeatherCron(newSchedule: string) {
  if (currentTask) {
    currentTask.stop();
    logger.info("🔄 Cron detenido para reconfiguración...");
  }

  currentTask = cron.schedule(newSchedule, async () => {
    logger.info("⏰ Ejecutando tarea de envío de clima...");
    await sendWeatherUpdate();
  });

  logger.info(`✅ Cron reiniciado con nueva frecuencia: ${newSchedule}`);
}
