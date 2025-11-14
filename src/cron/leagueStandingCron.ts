// src/cron/leagueStandingCron.ts
import cron from 'node-cron';
import { LeagueStandingService } from '../services/LeagueStandingService';
import { logger } from '../utils/logger';
import  Server  from '../config/Server';

const service = new LeagueStandingService();

// Lista de las 12 ligas (códigos de football-data.org)
const LEAGUES = [
  'PL',   // Premier League
  'PD',   // LaLiga
  'SA',   // Serie A
  'BL1',  // Bundesliga
  'FL1',  // Ligue 1
  'PPL',  // Primeira Liga
  'DED',  // Eredivisie
  'ELC',  // Championship
  'CL',   // Champions League
  'EC',   // Europa Conference League
  'EL',   // Europa League
  'BSA'   // Brasileirão (si aplica)
];

export function startLeagueStandingCron(server: Server) {
  // Cada 3 horas: 0 */3 * * *
  cron.schedule('0 */3 * * *', async () => {
    logger.info('Actualizando standings de 12 ligas...');
    await service.updateAllLeagues(LEAGUES);

    // Notificar por WebSocket
    server.websocketServer.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'standings-updated-all',
          timestamp: new Date().toISOString(),
          leagues: LEAGUES
        }));
      }
    });
  });

  logger.info('Cron de standings iniciado (cada 3 horas)');
}