import { Request, Response } from "express";
import WeatherLocationService from "../services/WeatherLocationService";

class WeatherLocationController {
  public getCityFromCoordinates = async (req: Request, res: Response) => {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) return res.status(400).json({ message: "Faltan lat o lon" });

      const city = await WeatherLocationService.getCityFromCoordinates(
        Number(lat),
        Number(lon)
      );

      res.status(200).json({ city });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Error al obtener la ciudad" });
    }
  };
}

export default new WeatherLocationController();
