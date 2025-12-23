// src/modules/forex/controllers/getForexTrends.controller.ts
import { Request, Response } from "express";
import { getForexTrends } from "../services/getForexTrends.service";

/**
 * GET /api/forex/trends
 * Devuelve todas las monedas frente a USD con su tendencia diaria
 */
export const getForexTrendsController = async (req: Request, res: Response) => {
  try {
    const data = await getForexTrends();
    res.json(data);
  } catch (error: any) {
    console.error("Error en getForexTrendsController:", error);
    res.status(500).json({ message: "Error obteniendo tendencias Forex" });
  }
};
