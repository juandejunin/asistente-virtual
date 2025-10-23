import TelegramBot from "node-telegram-bot-api";
import { config } from "../../config";
import { TelegramMessageService } from "./TelegramMessageService";
import { TelegramUserService } from "./TelegramUserService";
import WeatherService from "../WeatherService"; // ✅ IMPORT NORMAL
import ConfigService from "../ConfigService";   // ✅ IMPORT NORMAL

export class TelegramBotService {
  private bot: TelegramBot;
  private messageService: TelegramMessageService;
  private userService: TelegramUserService;
  private weatherService: WeatherService; // ✅ INSTANCIA

  constructor() {
    if (!config.telegramToken) throw new Error("❌ Telegram Token faltante!");

    this.bot = new TelegramBot(config.telegramToken, { polling: true });
    this.messageService = new TelegramMessageService(this.bot);
    this.userService = new TelegramUserService();
    this.weatherService = new WeatherService(); // ✅ CREAR AQUÍ

    this.initializeHandlers();
    console.log("🤖 Bot ACTIVO con botones interactivos!");
  }

  private initializeHandlers() {
    // ✅ 1. COMANDO /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.chat.first_name || "Usuario";

      // GUARDAR USUARIO EN DB
      await this.userService.saveOrUpdateUser(chatId, firstName);

      // MENSAJE CON BOTONES
      await this.messageService.sendMessageWithButtons(
        chatId,
        `¡Hola ${firstName}! 👋\n\n` +
        `🌟 *Bienvenido a nuestro servicio de información*\n\n` +
        `Selecciona el servicio que deseas:`,
        [
          [{ text: "☀️ Clima Diario", callback_data: "subscribe_weather" }]
        ]
      );
    });

    // ✅ 2. CLICK EN BOTÓN
    this.bot.on("callback_query", async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id!;
      const data = callbackQuery.data!;

      // ELIMINAR BOTÓN (UI limpia)
      await this.bot.answerCallbackQuery(callbackQuery.id);

      if (data === "subscribe_weather") {
        // SUSCRIBIR USUARIO
        await this.userService.addSubscription(chatId, "weather");
        
        await this.messageService.sendMessage(
          chatId,
          "✅ *¡SUSCRITO AL CLIMA DIARIO!* 🌤️\n\n" +
          "📅 Recibirás el pronóstico **TODAS LAS MAÑANAS A LAS 8:00 AM**\n\n" +
          "💡 *Comandos disponibles:*\n" +
          "`/clima` - Ver clima ahora\n" +
          "`/stop` - Cancelar suscripción"
        );
      }
    });

    // ✅ 3. COMANDO /clima (clima inmediato)
    this.bot.onText(/\/clima/, async (msg) => {
      const chatId = msg.chat.id;
      await this.sendCurrentWeather(chatId);
    });
  }

  // ✅ MÉTODO CORREGIDO - SIN IMPORT DINÁMICO
  private async sendCurrentWeather(chatId: number) {
    try {
      const weather = await this.weatherService.getTodayWeather(); // ✅ YA INSTANCIADO
      const { city } = ConfigService.getConfig();

      const message = `☀️ *Clima actual en ${city}*:\n\n` +
        `🌤️ ${weather.description}\n` +
        `🌡️ ${weather.temperature}°C\n` +
        `💧 ${weather.humidity}%\n` +
        `⏰ ${new Date().toLocaleTimeString('es-AR')}`;

      await this.messageService.sendMessage(chatId, message);
    } catch (err) {
      await this.messageService.sendMessage(chatId, "❌ Error obteniendo clima");
      console.error("❌ Error clima:", err);
    }
  }
}