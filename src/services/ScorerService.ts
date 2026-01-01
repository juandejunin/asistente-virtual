// src/services/ScorerService.ts
import { ScorerListModel } from "../models/ScorerListModel";
import { logger } from "../utils/logger";

export type ScorerType = "GOALS" | "YELLOW_CARDS" | "RED_CARDS";

interface Player {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
}

interface Team {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

interface Scorer {
  player: Player;
  team: Team;
  goals: number;
  assists: number;     
  penalties: number;   
}

export class ScorerService {
  private readonly apiUrl = "https://api.football-data.org/v4";
  private readonly apiKey = process.env.FOOTBALL_DATA_API_KEY;

  async getScorers(
    leagueCode: string,
    type: ScorerType,
    season?: number
  ): Promise<{ scorers: Scorer[]; season: number }> {
    // Hardcode temporal: temporada activa 2025/2026 hasta junio 2026 aprox
    const defaultSeason = 2025;

    const year = season || defaultSeason;
    const cacheKey = { leagueCode, season: year, type };

    // 1. Buscar en caché (con .lean() para objeto plano)
    const cached = await ScorerListModel.findOne(cacheKey)
      .sort({ fetchedAt: -1 })
      .lean<{ scorers: Scorer[]; season: number; fetchedAt: Date }>();

    const isFresh =
      cached &&
      Date.now() - new Date(cached.fetchedAt).getTime() < 1000 * 60 * 60 * 3; // 3h

    if (cached && isFresh) {
      logger.info(`[CACHE] Scorers ${type} ${leagueCode} (j${cached.season})`);
      return { scorers: cached.scorers, season: cached.season };
    }

    // 2. Validar API Key
    if (!this.apiKey) {
      throw new Error("Falta FOOTBALL_DATA_API_KEY en .env");
    }

    // 3. Fetch a football-data.org
    const url = `${this.apiUrl}/competitions/${leagueCode}/scorers?season=${year}&limit=100`;;
    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": this.apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} ${leagueCode}: ${errorText}`);
    }

    const data = await response.json();
    const rawScorers: any[] = data.scorers || [];
    // 4. Filtrar y mapear según tipo
    const filteredScorers = rawScorers
      .filter((s) => s.goals > 0) // Solo goleadores
      .map((s) => ({
        player: {
          id: s.player.id,
          name: s.player.name,
          firstName: s.player.firstName,
          lastName: s.player.lastName,
          nationality: s.player.nationality,
        },
        team: {
          id: s.team.id,
          name: s.team.name,
          shortName: s.team.shortName,
          tla: s.team.tla,
          crest: s.team.crest,
        },
        goals: s.goals || 0,
        assists: s.assists || 0, // ← NUEVO
        penalties: s.penalties || 0, // ← NUEVO
      }))
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 50);

    // 5. Guardar en DB
    const doc = {
      ...cacheKey,
      scorers: filteredScorers,
      fetchedAt: new Date(),
    };

    await ScorerListModel.findOneAndUpdate(cacheKey, doc, { upsert: true });

    logger.info(
      `[API] Scorers ${type} ${leagueCode} actualizados (${filteredScorers.length})`
    );
    return { scorers: filteredScorers, season: year };
  }

  // === CRON: Actualizar todas las ligas ===
  async updateAllLeagues(leagues: string[], type: ScorerType) {
    for (const code of leagues) {
      try {
        await this.getScorers(code, type);
      } catch (err: any) {
        logger.error(`[CRON] Fallo ${type} ${code}: ${err.message}`);
      }
    }
  }
}
