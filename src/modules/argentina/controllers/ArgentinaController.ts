// src/controllers/CurrencyController.ts
import { Request, Response } from 'express';
import { ArgentinaService } from '../services/ArgentinaService';

export class ArgentinaController {
  // Cotizaciones oficiales (Euro, Real, Peso Uruguayo, etc)
  static async getCotizaciones(req: Request, res: Response) {
    try {
      const data = await ArgentinaService.getCotizaciones(); // nueva función
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
  }

  // Dólares según el mercado (blue, oficial, CCL, etc)
  static async getDolares(req: Request, res: Response) {
    try {
      const data = await ArgentinaService.getDolares(); // nueva función para dolar-api
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener precios de dólares' });
    }
  }
}
