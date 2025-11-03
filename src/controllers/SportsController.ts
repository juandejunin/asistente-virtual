// src/controllers/SportsController.ts
import { Request, Response } from 'express';
import { SportsService } from '../services/SportsService';

export class SportsController {
  // 🔹 Devuelve los partidos top desde cache
  static async getTop(req: Request, res: Response) {
    try {
      const data = await SportsService.getCached("top");
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(data);
    } catch (err: any) {
      console.error("Error al obtener top matches:", err.message);
      res.status(500).json({ message: "Error al obtener top matches" });
    }
  }

  // 🔹 Devuelve noticias últimas 24h desde cache
  static async getLast24(req: Request, res: Response) {
    try {
      const data = await SportsService.getCached("last24");
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(data);
    } catch (err: any) {
      console.error("Error al obtener últimas 24h:", err.message);
      res.status(500).json({ message: "Error al obtener últimas 24h" });
    }
  }

  // 🔹 Devuelve torneos activos desde cache
  static async getTournament(req: Request, res: Response) {
    try {
      const data = await SportsService.getCached("tournament");
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(data);
    } catch (err: any) {
      console.error("Error al obtener torneos:", err.message);
      res.status(500).json({ message: "Error al obtener torneos" });
    }
  }
}
