// src/services/LeagueStandingService.ts
import { LeagueStandingModel } from '../models/LeagueStandingModel';
import { logger } from '../utils/logger';

export class LeagueStandingService {
  private apiUrl = 'https://api.football-data.org/v4';
  private apiKey = process.env.FOOTBALL_DATA_API_KEY;

  async getStandings(leagueCode: string, season?: number): Promise<any> {
    const year = season || new Date().getFullYear();
    const url = `${this.apiUrl}/competitions/${leagueCode}/standings?season=${year}`;

    // 1. Buscar en cache
    const cached = await LeagueStandingModel
      .findOne({ leagueCode, season: year })
      .sort({ fetchedAt: -1 });

    const isFresh = cached && (Date.now() - cached.fetchedAt.getTime()) < 1000 * 60 * 60 * 3; // 3h

    if (cached && isFresh) {
      logger.info(`Standings ${leagueCode} desde cache (j${cached.currentMatchday})`);
      return cached;
    }

    // 2. Fetch API con fetch nativo
    if (!this.apiKey) {
      throw new Error('Falta FOOTBALL_DATA_API_KEY en .env');
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Auth-Token': this.apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const standing = data.standings[0];

      const doc = {
        leagueCode,
        leagueName: data.competition.name,
        season: year,
        currentMatchday: data.season.currentMatchday,
        table: standing.table,
        fetchedAt: new Date(),
      };

      // 3. Guardar en DB
      await LeagueStandingModel.findOneAndUpdate(
        { leagueCode, season: year, currentMatchday: data.season.currentMatchday },
        doc,
        { upsert: true }
      );

      logger.info(`Standings ${leagueCode} actualizados (j${data.season.currentMatchday})`);
      return doc;

    } catch (error: any) {
      logger.error(`Error fetching ${leagueCode}:`, error.message);
      if (cached) {
        logger.warn(`Sirviendo cache desactualizado para ${leagueCode}`);
        return cached;
      }
      throw new Error(`No se pudo obtener standings de ${leagueCode}`);
    }
  }

  async updateAllLeagues(leagues: string[]) {
    for (const code of leagues) {
      try {
        await this.getStandings(code);
      } catch (err) {
        logger.error(`Fallo al actualizar ${code}`);
      }
    }
  }
}