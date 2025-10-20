import { config } from "./config";
import Server from "./config/Server";
import "./cron/weatherCron"; // Se carga automáticamente el cron

const server = new Server();
server.listen();

console.log(`✅ App iniciada. Ciudad configurada: ${config.city}`);
