// // src/crons/sportsCron.ts
// import cron, { ScheduledTask } from "node-cron";
// import { SportsService } from "../services/SportsService";
// import { logger } from "../utils/logger";
// import ConfigService from "../services/ConfigService";

// let sportsCacheCron: ScheduledTask | null = null;

// export function startSportsCacheCron() {
//   const { cronSchedule } = ConfigService.getConfig(); // Podés tener un cronSchedule específico para deportes
//   sportsCacheCron = cron.schedule(cronSchedule, async () => {
//     logger.info("⏰ Ejecutando cron de actualización de cache de deportes...");
//     try {
//       await SportsService.refreshCache();
//       logger.info("✅ Cache de deportes actualizada correctamente");
//     } catch (err: any) {
//       logger.error("❌ Error actualizando cache de deportes:", err.message);
//     }
//   });

//   logger.info(`🕐 Cron de deportes iniciado con frecuencia: ${cronSchedule}`);
// }

// export function restartSportsCacheCron(newSchedule: string) {
//   if (sportsCacheCron) {
//     sportsCacheCron.stop();
//     logger.info("🔄 Cron de deportes detenido para reconfiguración...");
//   }

//   sportsCacheCron = cron.schedule(newSchedule, async () => {
//     logger.info("⏰ Ejecutando cron de actualización de cache de deportes...");
//     try {
//       await SportsService.refreshCache();
//       logger.info("✅ Cache de deportes actualizada correctamente");
//     } catch (err: any) {
//       logger.error("❌ Error actualizando cache de deportes:", err.message);
//     }
//   });

//   logger.info(`✅ Cron de deportes reiniciado con nueva frecuencia: ${newSchedule}`);
// }
 

import cron, { ScheduledTask } from "node-cron";
import { SportsService } from "../services/SportsService";
import { logger } from "../utils/logger";
import Server from "../config/Server"; // para enviar WS

let currentTask: ScheduledTask | null = null;

export function startSportsCacheCron(serverInstance: Server) {
  const schedule = "*/30 * * * *"; // cada x minutos, por ejemplo
  currentTask = cron.schedule(schedule, async () => {
    try {
      logger.info("⏰ Actualizando cache de deportes...");
      await SportsService.refreshCache();

      // Notificar a todos los clientes conectados por WS
      const data = await SportsService.getCached("top");
      serverInstance.websocketServer.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({ type: "sports-update", payload: data }));
        }
      });

      logger.info("✅ Cache de deportes actualizada y enviada a WS");
    } catch (error: any) {
      logger.error("❌ Error en cron de deportes:", error.message);
    }
  });

  logger.info(`🕐 Cron de deportes iniciado con frecuencia: ${schedule}`);
}

export function restartSportsCacheCron(serverInstance: Server, newSchedule: string) {
  if (currentTask) {
    currentTask.stop();
    logger.info("🔄 Cron de deportes detenido para reconfiguración...");
  }

  currentTask = cron.schedule(newSchedule, async () => {
    try {
      logger.info("⏰ Actualizando cache de deportes...");
      await SportsService.refreshCache();

      const data = await SportsService.getCached("top");
      serverInstance.websocketServer.clients.forEach((client) => {
        if (client.readyState === 1) client.send(JSON.stringify({ type: "sports-update", payload: data }));
      });

      logger.info("✅ Cache de deportes actualizada y enviada a WS");
    } catch (error: any) {
      logger.error("❌ Error en cron de deportes:", error.message);
    }
  });

  logger.info(`✅ Cron de deportes reiniciado con nueva frecuencia: ${newSchedule}`);
}
