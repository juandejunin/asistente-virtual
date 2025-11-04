// src/cron/leagueSeasonCron.ts
import cron from "node-cron";
import { LEAGUES_CONFIG, SEASON } from "../config/leagues.config";
import { SeasonService } from "../services/SeasonService";
import { LeagueSeasonModel } from "../models/LeagueSeasonModel";
import { logger } from "../utils/logger";

export function startLeagueSeasonCron() {
  cron.schedule("0 3 * * 0", async () => { // Domingo 3 AM
    logger.info(`Actualizando temporada ${SEASON} para ${LEAGUES_CONFIG.length} ligas...`);

    for (const league of LEAGUES_CONFIG) {
      const { id, name, country, slug } = league;

      try {
        const [
          standingsRes,
          topScorersRes,
          topAssistsRes,
          fixturesRes,
          leastConceded
        ] = await Promise.all([
          SeasonService.getStandings(id),
          SeasonService.getTopScorers(id),
          SeasonService.getTopAssists(id),
          SeasonService.getFixtures(id),
          SeasonService.getLeastConceded(id)
        ]);

        await LeagueSeasonModel.updateOne(
          { leagueId: id, season: SEASON },
          {
            slug,
            name,
            country,
            standings: standingsRes.response?.[0]?.league?.standings?.[0] || [],
            topScorers: topScorersRes.response || [],
            topAssists: topAssistsRes.response || [],
            fixtures: fixturesRes.response || [],
            leastConceded,
            fetchedAt: new Date(),
          },
          { upsert: true }
        );

        logger.info(`${name} (${slug}) actualizada`);
      } catch (err: any) {
        logger.error(`Error en ${name} (${slug}): ${err.message}`);
      }
    }

    logger.info("Todas las ligas actualizadas");
  });

  logger.info("Cron de temporada iniciado: domingo 3 AM");
}