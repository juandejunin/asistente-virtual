// src/controllers/ScorerController.ts
import { Request, Response } from 'express';
import { ScorerService } from '../services/ScorerService';

const service = new ScorerService();

export class ScorerController {
  async getScorers(req: Request, res: Response) {
    const { leagueCode } = req.params;
    const season = req.query.season ? parseInt(req.query.season as string) : undefined;
    const type = (req.path.includes('yellow') ? 'YELLOW_CARDS' : req.path.includes('red') ? 'RED_CARDS' : 'GOALS') as any;

    if (!/^[A-Z0-9]{2,3}$/.test(leagueCode)) {
      return res.status(400).json({ message: 'Código inválido' });
    }

    try {
      const data = await service.getScorers(leagueCode, type, season);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}