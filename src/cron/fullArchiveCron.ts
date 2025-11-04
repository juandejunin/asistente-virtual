// src/crons/fullArchiveCron.ts
import cron, { ScheduledTask } from "node-cron";
import { SportsArchiveService } from "../services/SportsArchiveService";
import { logger } from "../utils/logger";
import Server from "../config/Server";

let task: ScheduledTask | null = null;

export function startFullArchiveCron(server: Server) {
  const schedule = "0 1 * * *"; // 1 AM todos los días

  task = cron.schedule(schedule, async () => {
    logger.info("Ejecutando archivo completo de deportes (1 AM)...");
    try {
      const result = await SportsArchiveService.refreshFullArchive();

      // Notificar por WS
      const leagues = await SportsArchiveService.getAvailableLeagues(
        new Date().toISOString().split('T')[0]
      );
      server.websocketServer.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "full-archive-update",
            payload: { leagues, count: result.count }
          }));
        }
      });

      logger.info("Archivo completo actualizado y notificado");
    } catch (err: any) {
      logger.error("Error en full archive cron:", err.message);
    }
  });

  logger.info(`Cron de archivo completo iniciado: ${schedule}`);
}

export function stopFullArchiveCron() {
  if (task) task.stop();
  logger.info("Cron de archivo completo detenido");
}