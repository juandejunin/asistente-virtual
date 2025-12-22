// src/modules/forex/controllers/ForexHistoryController.ts
import { Request, Response } from "express";
import { ForexHistoryService } from "../services/ForexHistoryService";

export class ForexHistoryController {
  /**
   * 📈 Histórico OHLC
   * GET /api/forex/history/:currency
   */
  static async getHistory(req: Request, res: Response) {
    try {
      const { currency } = req.params;
      const { from, to } = req.query;

      if (!currency) {
        return res.status(400).json({ message: "Currency is required" });
      }

      const data = await ForexHistoryService.getOHLC(
        currency.toUpperCase(),
        from as string | undefined,
        to as string | undefined
      );

      res.json({
        currency: currency.toUpperCase(),
        count: data.length,
        data,
      });
    } catch (error) {
      console.error("Error fetching forex history:", error);
      res.status(500).json({ message: "Error fetching forex history" });
    }
  }

  /**
   * 🔼 Tendencia diaria
   * GET /api/forex/trend/:currency
   */
  static async getTrend(req: Request, res: Response) {
    try {
      const { currency } = req.params;

      if (!currency) {
        return res.status(400).json({ message: "Currency is required" });
      }

      const trend = await ForexHistoryService.getDailyTrend(
        currency.toUpperCase()
      );

      if (!trend) {
        return res.status(404).json({ message: "Not enough data" });
      }

      res.json(trend);
    } catch (error) {
      console.error("Error fetching forex trend:", error);
      res.status(500).json({ message: "Error fetching forex trend" });
    }
  }
}
