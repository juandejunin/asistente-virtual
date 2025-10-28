import { config, WeatherConfig } from "../config";

class ConfigService {
  public static getConfig(): WeatherConfig {
    return config;
  }
}

export default ConfigService;