import express, { Application, Request, Response } from "express";
import { WebSocketServer } from "ws";
import http from "http";
import WeatherRoutes from "../routes/weather.routes";
// src/index.ts o Server.ts
import '../cron/weatherCron';


class Server {
  private app: Application;
  private port: string;
  private server: http.Server;
  private wss: WebSocketServer;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    this.middlewares();
    this.routes();

    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.websocketHandlers();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "🛰️ Service Audiovisual activo" });
    });

    this.app.use("/api/weather", WeatherRoutes);
  }

  private websocketHandlers() {
    this.wss.on("connection", (ws) => {
      console.log("Nuevo cliente conectado 🌐");
      ws.send(JSON.stringify({ message: "Conectado al servidor 🔊" }));

      ws.on("message", (data) => console.log("Mensaje recibido:", data.toString()));
      ws.on("close", () => console.log("Cliente desconectado 🚪"));
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`🚀 Servidor HTTP + WS corriendo en puerto ${this.port}`);
    });
  }
}

export default Server;
