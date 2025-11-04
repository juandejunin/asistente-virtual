// src/controllers/SportsArchiveController.ts
import { Request, Response } from 'express';
import { SportsArchiveService } from '../services/SportsArchiveService';

export class SportsArchiveController {
  // 1. Lista de ligas disponibles (para menú)
  static async getLeagues(req: Request, res: Response) {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const date = yesterday.toISOString().split('T')[0];

      const leagues = await SportsArchiveService.getAvailableLeagues(date);
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.json(leagues);
    } catch (err: any) {
      console.error('Error al obtener ligas:', err.message);
      res.status(500).json({ message: 'Error al obtener ligas' });
    }
  }

  // 2. Partidos de una liga específica
  static async getLeague(req: Request, res: Response) {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Parámetro "name" requerido' });
    }

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const date = yesterday.toISOString().split('T')[0];

      const result = await SportsArchiveService.getLeague(date, name);
      if (!result) {
        return res.status(404).json({ message: 'Liga no encontrada' });
      }

      res.set('Content-Type', 'application/json; charset=utf-8');
      res.json(result.matches);
    } catch (err: any) {
      console.error('Error al obtener partidos de liga:', err.message);
      res.status(500).json({ message: 'Error al obtener partidos de la liga' });
    }
  }

  static async getLeagueBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  if (!slug) {
    return res.status(400).json({ message: 'Slug requerido' });
  }

  try {
    // Convertir slug → nombre real
    const leagueName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];

    const result = await SportsArchiveService.getLeague(date, leagueName);
    if (!result) {
      return res.status(404).json({ message: 'Liga no encontrada' });
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(result.matches);
  } catch (err: any) {
    console.error('Error al obtener liga por slug:', err.message);
    res.status(500).json({ message: 'Error interno' });
  }
}
}