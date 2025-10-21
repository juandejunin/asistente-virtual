import express, { Application, NextFunction, Request, Response } from "express";
import { WebSocketServer } from "ws";
import http from "http";
import WeatherRoutes from "../routes/weather.routes";
import { config } from "./index";
import { logger } from "../utils/logger";
import ConfigRoutes from "../routes/config.routes";

class Server {
  private app: Application;
  private port = config.port;
  private server: http.Server;
  private wss: WebSocketServer;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();

    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.websocketHandlers();
  }

  private middlewares() {
    this.app.use(express.json());
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
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "🛰️ Service Audiovisual activo" });
    });

    this.app.use("/api/weather", WeatherRoutes);
    this.app.use("/api/config", ConfigRoutes);
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

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`🚀 Servidor HTTP + WS corriendo en puerto ${this.port}`);
    });
  }
}

export default Server;
