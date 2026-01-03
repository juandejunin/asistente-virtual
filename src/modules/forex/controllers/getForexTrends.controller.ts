import { Request, Response } from "express";
import { getForexTrends } from "../services/getForexTrends.service";
import { ForexTrendsResponseSchema } from "../../../lib/types/forex";

export const getForexTrendsController = async (req: Request, res: Response) => {
  try {
    const daysQuery = req.query.days as string;
    const compareDays = daysQuery
      ? daysQuery.split(",").map(d => parseInt(d, 10))
      : [1];

    const data = await getForexTrends(compareDays);

    // Validación completa con Zod
    const parseResult = ForexTrendsResponseSchema.safeParse(data);

    if (!parseResult.success) {
      console.error("Datos Forex inválidos:", parseResult.error);
      return res.status(500).json({
        success: false,
        error: "Datos Forex inválidos",
      });
    }

    // OK, datos correctos
    res.json({ success: true, data: parseResult.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error obteniendo tendencias Forex" });
  }
};
