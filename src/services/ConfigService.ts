import { config } from "../config";
import { logger } from "../utils/logger";

interface WeatherConfig {
  city: string;
  cronSchedule: string;
}

class ConfigService {
  private settings: WeatherConfig = {
    city: config.city,
    cronSchedule: "0 8 * * *", // por defecto 8:00 AM
  };

  public getConfig(): WeatherConfig {
    return this.settings;
  }

  public updateConfig(newConfig: Partial<WeatherConfig>): WeatherConfig {
    if (newConfig.city) {
      this.settings.city = newConfig.city;
      logger.info(`🏙️ Ciudad actualizada a: ${newConfig.city}`);
    }
    if (newConfig.cronSchedule) {
      this.settings.cronSchedule = newConfig.cronSchedule;
      logger.info(`⏰ Horario de envío actualizado a: ${newConfig.cronSchedule}`);
    }
    return this.settings;
  }
}

export default new ConfigService();
