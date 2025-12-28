// src/modules/forex/controllers/getForexTrends.controller.ts
import { Request, Response } from "express";
import { getForexTrends } from "../services/getForexTrends.service";

/**
 * GET /api/forex/trends
 * Devuelve todas las monedas frente a USD con su tendencia diaria
 */
export const getForexTrendsController = async (req: Request, res: Response) => {
  try {
    const daysQuery = req.query.days as string;
    const compareDays = daysQuery ? daysQuery.split(",").map(d => parseInt(d, 10)) : [1];

    const trends = await getForexTrends(compareDays);
    res.json({ success: true, data: trends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error obteniendo tendencias Forex' });
  }
};

