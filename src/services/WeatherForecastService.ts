// src/services/WeatherForecastService.ts
import WeatherService from './WeatherService';
import ConfigService from './ConfigService';

export interface HourlyForecastEntry {
  time: string;           // "14:00"
  timestamp: number;      // Unix epoch
  description: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
}

export interface HourlyForecastResponse {
  city: string;
  forecast: HourlyForecastEntry[];
}

export class WeatherForecastService {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  /**
   * Pronóstico por horas (hoy + mañana)
   * @param city - Ciudad opcional (si no, usa config)
   */
  public async getHourlyForecast(city?: string): Promise<HourlyForecastResponse> {
    const selectedCity = city || ConfigService.getConfig().city;
    const raw = await this.weatherService.getDailyForecast(selectedCity);

    const formatted: HourlyForecastEntry[] = raw.map(entry => ({
      time: new Date(entry.time * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      timestamp: entry.time * 1000,
      description: entry.description,
      temperature: entry.temperature,
      feels_like: entry.feels_like,
      humidity: entry.humidity,
      wind_speed: entry.wind_speed,
      wind_deg: entry.wind_deg,
    }));

    return {
      city: selectedCity,
      forecast: formatted,
    };
  }

  /**
   * Solo hoy (primeras 8 entradas ~24h)
   */
  public async getTodayHourly(city?: string): Promise<HourlyForecastResponse> {
    const full = await this.getHourlyForecast(city);
    return {
      city: full.city,
      forecast: full.forecast.slice(0, 8),
    };
  }
}