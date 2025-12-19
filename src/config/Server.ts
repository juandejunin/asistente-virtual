import express, { Application, NextFunction, Request, Response } from "express";
import { WebSocketServer } from "ws";
import http from "http";
import WeatherRoutes from "../routes/weather.routes";
import { config } from "./index";
import { logger } from "../utils/logger";
import ConfigRoutes from "../routes/config.routes";
import cors from "cors";
import { connectToDatabase } from "../config/database";

import { setupSwagger } from "./swagger";

import GeoRoutes from "../routes/geo.routes";
import { argentinaRoutes } from "../modules/argentina";

import sportRoutes from "../routes/deportes.routes";
import { startSportsCacheCron } from "../cron/sportsCron";

import { startFullArchiveCron } from "../cron/fullArchiveCron";
// Al inicio del archivo
import deportesArchiveRoutes from "../routes/deportesArchive.routes";

import seasonRoutes from "../routes/season.routes";
import authRoutes from "../routes/auth.routes";

import cookieParser from "cookie-parser";
import { forexRoutes } from "../modules/forex";
import { cryptoRoutes } from "../modules/crypto";
import { economyRoutes } from "../modules/economy";
import { TelegramBotService } from "../services/Telegram";

class Server {
  private app: Application;
  private port = config.port;
  private server: http.Server;
  private wss: WebSocketServer;

  public get websocketServer(): WebSocketServer {
    return this.wss;
  }

  constructor() {
    this.app = express();
    this.app.set("trust proxy", true);
    this.middlewares();
    this.routes();

    // new TelegramBotService();

    setupSwagger(this.app);

    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.websocketHandlers();
  }

  private middlewares() {
    this.app.use(express.json());

    // 🧩 Manejar errores de JSON inválido
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof SyntaxError && "body" in err) {
          console.error("❌ Error de sintaxis en JSON:", err.message);
          return res.status(400).json({
            message: "El cuerpo de la petición no es un JSON válido.",
          });
        }
        next();
      }
    );

    this.app.use(cookieParser());

    // 🌍 Habilitar CORS (permitir el frontend y pruebas locales)
    this.app.use(
      cors({
        origin: "*",
      })
    );

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith("/email/notifications")) {
        const ip =
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "IP desconocida";
        const userAgent = req.headers["user-agent"] || "User-Agent desconocido";
        console.warn(`🚨 Intento no autorizado detectado:
    Ruta: ${req.path}
    Método: ${req.method}
    IP: ${ip}
    User-Agent: ${userAgent}
    Hora: ${new Date().toISOString()}
    `);
      }
      next();
    });
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "🛰️ Service Audiovisual activo" });
    });

    // 🧭 Rutas principales
    this.app.use("/api/weather", WeatherRoutes);
    this.app.use("/api/config", ConfigRoutes);
    this.app.use("/api/geo", GeoRoutes);

    this.app.use("/api/deportes", sportRoutes);
    this.app.use("/api/deportes/archive", deportesArchiveRoutes);
    this.app.use("/api/season", seasonRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/forex", forexRoutes); // Solo forex
    this.app.use("/api/crypto", cryptoRoutes);
    this.app.use("/api/economy", economyRoutes);

    this.app.use("/api/cotizaciones", argentinaRoutes); // Legacy
    this.app.use("/api/dolares", argentinaRoutes); // Legacy
    this.app.use("/api/economy/argentina", argentinaRoutes); // Nueva
  }

  private websocketHandlers() {
    this.wss.on("connection", (ws) => {
      logger.info("🌐 Nuevo cliente conectado");
      ws.send(JSON.stringify({ message: "Conectado al servidor 🔊" }));

      ws.on("message", (data) =>
        logger.info("📩 Mensaje recibido:", data.toString())
      );
      ws.on("close", () => logger.info("🚪 Cliente desconectado"));
    });
  }

  public async listen() {
    await connectToDatabase();

    this.server.listen(this.port, () => {
      logger.info(`🚀 Servidor HTTP + WS corriendo en puerto ${this.port}`);
    });

    startSportsCacheCron(this);
    startFullArchiveCron(this);
  }
}

export default Server;
