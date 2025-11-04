// src/services/SportsArchiveService.ts
import { SportsFullArchiveModel } from "../models/SportsFullArchive";
import { SportsLeagueArchiveModel } from "../models/SportsLeagueArchive";

export class SportsArchiveService {
  private static API_KEY = process.env.SPORTS_API_KEY!;
  private static BASE_URL = 'https://v3.football.api-sports.io';

  static async refreshFullArchive() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const date = yesterday.toISOString().split('T')[0];

      const url = `${this.BASE_URL}/fixtures?date=${date}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-apisports-key': this.API_KEY },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      const allFixtures = json.response || [];

      // 1. Guardar raw completo
      await SportsFullArchiveModel.updateOne(
        { date },
        { fixtures: allFixtures, fetchedAt: new Date() },
        { upsert: true }
      );

      // 2. Agrupar por liga y guardar
      const grouped: Record<string, any[]> = {};
      allFixtures.forEach((f: any) => {
        const league = f.league.name;
        grouped[league] = grouped[league] || [];
        grouped[league].push({
          home: f.teams.home.name,
          away: f.teams.away.name,
          homeGoals: f.goals.home ?? '-',
          awayGoals: f.goals.away ?? '-',
          status: f.fixture.status.short,
          time: new Date(f.fixture.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          homeLogo: f.teams.home.logo,
          awayLogo: f.teams.away.logo,
        });
      });

      for (const [league, matches] of Object.entries(grouped)) {
        await SportsLeagueArchiveModel.updateOne(
          { date, league },
          { matches, fetchedAt: new Date() },
          { upsert: true }
        );
      }

      console.log(`Archivo completo guardado: ${allFixtures.length} partidos, ${Object.keys(grouped).length} ligas`);
      return { success: true, count: allFixtures.length };
    } catch (err: any) {
      console.error("Error en refreshFullArchive:", err.message);
      throw err;
    }
  }

  // Para frontend: obtener una liga
  static async getLeague(date: string, league: string) {
    return await SportsLeagueArchiveModel.findOne({ date, league }).lean();
  }

  // Para menú de ligas
  static async getAvailableLeagues(date: string) {
    const result = await SportsLeagueArchiveModel.find({ date }).select('league').lean();
    return result.map(r => r.league);
  }
}