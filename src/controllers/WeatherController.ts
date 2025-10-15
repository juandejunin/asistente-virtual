import { Request, Response } from "express";
import WeatherService from "../services/WeatherService";

class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  public getTodayWeather = async (req: Request, res: Response): Promise<void> => {
    try {
      const weather = await this.weatherService.getTodayWeather();

      const message = `☀️ Clima en ${process.env.CITY}:
- Estado: ${weather.description}
- Temperatura: ${weather.temperature}°C
- Humedad: ${weather.humidity}%`;

      res.status(200).json({ message, data: weather });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el clima", error });
    }
  };
}

export default WeatherController;
