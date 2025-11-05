import { Request, Response } from "express";
import CityService from "../services/CityService";

export class CityController {
  private service: CityService;

  constructor() {
    this.service = new CityService();
  }

  public searchCities = async (req: Request, res: Response): Promise<void> => {
    try {
      const q = req.query.q as string;
      const cities = await this.service.searchCities(q);
      res.status(200).json(cities);
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Error al buscar ciudades",
      });
    }
  };
}
