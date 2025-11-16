// src/cron/scorerCron.ts
import cron from 'node-cron';
import { ScorerService } from '../services/ScorerService';
import { logger } from '../utils/logger';
import Server from '../config/Server';

const service = new ScorerService();
const LEAGUES = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'PPL', 'DED', 'ELC', 'CL', 'EC', 'EL', 'BSA'];

export function startScorerCron(server: Server) {
  cron.schedule('0 */6 * * *', async () => { // cada 6h
    logger.info('Actualizando goleadores y tarjetas...');
    await service.updateAllLeagues(LEAGUES, 'GOALS');
    await service.updateAllLeagues(LEAGUES, 'YELLOW_CARDS');
    await service.updateAllLeagues(LEAGUES, 'RED_CARDS');

    server.websocketServer.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'scorers-updated', timestamp: new Date() }));
      }
    });
  });

  logger.info('Cron de goleadores/tarjetas iniciado (cada 6h)');
}