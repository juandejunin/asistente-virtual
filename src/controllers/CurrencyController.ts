// src/controllers/CurrencyController.ts
import { Request, Response } from 'express';
import { ExchangeService } from '../services/CurrencyService';

export class CurrencyController {
  static async getRates(req: Request, res: Response) {
    try {
      const base = req.query.base?.toString() || 'USD';
      const data = await ExchangeService.getRates(base);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
  }
}
