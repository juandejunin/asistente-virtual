import cron, { ScheduledTask } from "node-cron";
import { ForexService } from "../modules/forex/services/ForexService";
import { logger } from "../utils/logger";

let forexTask: ScheduledTask | null = null;

export function startForexCron() {
  // cada 15 minutos
  const schedule = "*/15 * * * *";

  forexTask = cron.schedule(schedule, async () => {
    try {
      logger.info("💱 Actualizando OHLC Forex...");
      await ForexService.updateDailyOHLC();
    } catch (err) {
      logger.error("❌ Error en Forex Cron", err);
    }
  });

  logger.info(`🕐 Forex cron iniciado (${schedule})`);
}
