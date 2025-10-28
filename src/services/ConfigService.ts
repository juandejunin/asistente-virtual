// import { config, WeatherConfig } from "../config";

// class ConfigService {
//   public static getConfig(): WeatherConfig {
//     return config;
//   }
// }

// export default ConfigService;

import { config as baseConfig, WeatherConfig } from "../config";
import { logger } from "../utils/logger";

interface UpdatableConfig {
  city?: string;
  cronSchedule?: string;
}

class ConfigService {
  private static settings: WeatherConfig = { ...baseConfig };

  public static getConfig(): WeatherConfig {
    return this.settings;
  }

  public static updateConfig(newConfig: Partial<UpdatableConfig>): WeatherConfig {
    if (newConfig.city) {
      this.settings.city = newConfig.city;
      logger.info(`Ciudad actualizada a: ${newConfig.city}`);
    }
    if (newConfig.cronSchedule) {
      this.settings.cronSchedule = newConfig.cronSchedule;
      logger.info(`Cron actualizado a: ${newConfig.cronSchedule}`);
    }
    return this.settings;
  }
}

export default ConfigService;