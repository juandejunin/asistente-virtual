// src/controllers/WeatherController.ts
import { Request, Response } from "express";
import WeatherService from "../services/WeatherService";
import geoip from "geoip-lite";
import { WeatherForecastService } from "../services/WeatherForecastService"; // ← NUEVO

function getClientIp(req: Request): string {
  let ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "";
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
  // En entornos locales puede venir "::1" o "127.0.0.1"
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}

function getCityFromReq(req: Request): {
  city: string;
  country: string;
  ip: string;
} {
  const ip = getClientIp(req);
  const geo = geoip.lookup(ip);
  const city = (geo?.city || "Madrid").toString();
  const country = (geo?.country || "ES").toString();
  return { city, country, ip };
}

class WeatherController {
  private weatherService: WeatherService;
  private forecastService: WeatherForecastService; // ← NUEVO

  constructor() {
    this.weatherService = new WeatherService();
    this.forecastService = new WeatherForecastService(); // ← NUEVO
  }

  /** GET /api/weather?city=Opcional */
  public getTodayWeather = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { ip, city: inferredCity, country } = getCityFromReq(req);
      const cityParam = (req.query.city as string) || undefined; // permitir override por query
      const city = cityParam || inferredCity;

      const weather = await this.weatherService.getTodayWeather(city);

      res.status(200).json({
        location: { ip, city, country },
        weather: {
          description: weather.description,
          temperature: weather.temperature,
          feels_like: weather.feels_like,
          humidity: weather.humidity,
          wind_speed: weather.wind_speed,
          wind_deg: weather.wind_deg,
          pressure: weather.pressure,
          visibility: weather.visibility,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener el clima",
        // No exponer detalles internos; si quieres, loggea 'error' en el servidor
      });
    }
  };

  /** ✅ NUEVO: GET /api/air?city=Opcional */
  public getAirQuality = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ip, city: inferredCity, country } = getCityFromReq(req);
      const cityParam = (req.query.city as string) || undefined;
      const city = cityParam || inferredCity;

      const aq = await this.weatherService.getAirQualityByCity(city);

      res.status(200).json({
        location: { ip, city, country },
        air: {
          aqi: aq.aqi,
          label: aq.label,
          emoji: aq.emoji,
          formatted: this.weatherService.formatAirQuality(aq),
          components: aq.components, // μg/m³
          timestamp: aq.timestamp,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener la calidad del aire",
      });
    }
  };

  /** ✅ NUEVO: GET /api/weather-air?city=Opcional (todo en una) */
  public getWeatherAndAir = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { ip, city: inferredCity, country } = getCityFromReq(req);
      const cityParam = (req.query.city as string) || undefined;
      const city = cityParam || inferredCity;

      // Ejecutar en paralelo para menor latencia
      const [weather, aq] = await Promise.all([
        this.weatherService.getTodayWeather(city),
        this.weatherService.getAirQualityByCity(city),
      ]);

      res.status(200).json({
        location: { ip, city, country },
        weather: {
          description: weather.description,
          temperature: weather.temperature,
          feels_like: weather.feels_like,
          humidity: weather.humidity,
          wind_speed: weather.wind_speed,
          wind_deg: weather.wind_deg,
          pressure: weather.pressure,
          visibility: weather.visibility,
        },
        air: {
          aqi: aq.aqi,
          label: aq.label,
          emoji: aq.emoji,
          formatted: this.weatherService.formatAirQuality(aq),
          components: aq.components,
          timestamp: aq.timestamp,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener clima y calidad del aire",
      });
    }
  };
  /** GET /api/forecast?city=Opcional&today=true */
  public getDailyForecast = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { ip, city: inferredCity, country } = getCityFromReq(req);
      const cityParam = (req.query.city as string) || undefined;
      const todayOnly = req.query.today === "true";
      const city = cityParam || inferredCity;

      const data = todayOnly
        ? await this.forecastService.getTodayHourly(city)
        : await this.forecastService.getHourlyForecast(city);

      res.status(200).json({
        location: { ip, city, country },
        city: data.city,
        forecast: data.forecast, // Array con time, temp, desc, etc.
        today: todayOnly,
      });
    } catch (error: any) {
      console.error("Error en getDailyForecast:", error);
      res.status(500).json({
        message: "Error al obtener el pronóstico",
      });
    }
  };
}

export default WeatherController;
