// src/controllers/SeasonController.ts
import { Request, Response } from 'express';
import { LeagueSeasonModel } from '../models/LeagueSeasonModel';
import { SLUG_TO_LEAGUE, LEAGUES_CONFIG } from '../config/leagues.config';

export class SeasonController {
  static async getBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const leagueConfig = SLUG_TO_LEAGUE[slug];

    if (!leagueConfig) {
      return res.status(404).json({ message: 'Liga no encontrada' });
    }

    try {
      const data = await LeagueSeasonModel.findOne({
        leagueId: leagueConfig.id,
        season: 2025
      }).lean();

      if (!data) {
        return res.status(404).json({ message: 'Datos no disponibles' });
      }

      // Enriquecer con slug y metadata
      res.json({
        slug,
        ...leagueConfig,
        ...data
      });
    } catch (err: any) {
      console.error(`Error en getBySlug(${slug}):`, err.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Lista de ligas disponibles
  static async getLeagues(req: Request, res: Response) {
    res.json(
      LEAGUES_CONFIG.map(({ slug, name, country }) => ({
        slug,
        name,
        country
      }))
    );
  }
}