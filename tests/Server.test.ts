import request from "supertest";
import  Server  from "../src/config/Server";
import { connectToDatabase } from "../src/config/database";
import { TelegramBotService } from "../src/services/Telegram";

jest.mock("../src/config/database");
jest.mock("../src/services/Telegram");

describe("Server", () => {
  let server: Server;
  let app: any;

  beforeEach(() => {
    (connectToDatabase as jest.Mock).mockResolvedValue(undefined);
    (TelegramBotService as jest.Mock).mockImplementation(() => ({}));
    server = new Server();
    app = server["app"]; // Acceso privado para pruebas
  });

  test("GET / returns welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "🛰️ Service Audiovisual activo" });
  });

  test("handles invalid JSON with 400 error", async () => {
    const response = await request(app)
      .post("/api/weather")
      .set("Content-Type", "application/json")
      .send("invalid json");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "El cuerpo de la petición no es un JSON válido.",
    });
  });

  test("allows CORS for all origins", async () => {
    const response = await request(app).get("/");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });
});