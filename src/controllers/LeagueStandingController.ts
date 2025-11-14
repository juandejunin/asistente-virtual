// src/controllers/LeagueStandingController.ts
import { Request, Response } from 'express';
import { LeagueStandingService } from '../services/LeagueStandingService';

const service = new LeagueStandingService();

export class LeagueStandingController {
  async getStandings(req: Request, res: Response) {
    try {
      const { leagueCode } = req.params;
      const season = req.query.season ? parseInt(req.query.season as string) : undefined;

      if (!leagueCode || !/^[A-Z0-9]{2,3}$/.test(leagueCode)) {
        return res.status(400).json({ message: 'Código de liga inválido' });
      }

      const data = await service.getStandings(leagueCode, season);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}