import TelegramBot from "node-telegram-bot-api";
import { config, WeatherConfig } from "../../config";
import { TelegramMessageService } from "./TelegramMessageService";
import { TelegramUserService } from "./TelegramUserService";
import WeatherService from "../WeatherService";
import ConfigService from "../ConfigService";
import { TelegramUserModel, ITelegramUser } from "../../models/TelegramUser.model";
import WeatherLocationService from "../WeatherLocationService";

export class TelegramBotService {
  private bot: TelegramBot;
  private messageService: TelegramMessageService;
  private userService: TelegramUserService;
  private weatherService: WeatherService;

  constructor() {
    const cfg: WeatherConfig = config;
    if (!cfg.telegramToken) throw new Error("❌ Telegram Token faltante!");
    this.bot = new TelegramBot(cfg.telegramToken, { polling: true });

  
    this.messageService = new TelegramMessageService(this.bot);
    this.userService = new TelegramUserService();
    this.weatherService = new WeatherService();

    this.initializeHandlers();
    console.log("🤖 Bot ACTIVO con UBICACIÓN y botones interactivos!");
  }

  private initializeHandlers() {
    // ✅ 1. COMANDO /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.chat.first_name || "Usuario";

      await this.userService.saveOrUpdateUser(chatId, firstName);

      await this.messageService.sendMessageWithButtons(
        chatId,
        `¡Hola ${firstName}! 👋\n\n` +
        `🌟 *Bienvenido a nuestro servicio de información*\n\n` +
        `Selecciona el servicio que deseas:`,
        [[{ text: "☀️ Clima Diario", callback_data: "subscribe_weather" }]]
      );
    });

    // ✅ 2. CLICK EN BOTÓN
    this.bot.on("callback_query", async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id!;
      const data = callbackQuery.data!;
      await this.bot.answerCallbackQuery(callbackQuery.id);

      if (data === "subscribe_weather") {
        await this.userService.addSubscription(chatId, "weather");
        await this.askForLocation(chatId);
      }

      if (data === "set_location") {
        await this.askForLocation(chatId);
      }

      if (data === "cancel_location") {
        await this.showMainButtons(chatId);
      }

      if (data === "weather_now") {
        await this.sendDailyForecast(chatId);
        await this.showMainButtons(chatId);
      }

      if (data === "more_services") {
        await this.messageService.sendMessage(
          chatId,
          "🔄 *Próximamente:*\n\n• 📺 Noticias locales\n• 🚗 Tráfico\n• 💰 Dólar blue"
        );
        await this.showMainButtons(chatId);
      }
    });

    // 🔥 3. RECIBIR UBICACIÓN GPS
    this.bot.on("location", async (msg) => {
      const chatId = msg.chat.id;
      const { latitude, longitude } = msg.location!;

      try {
        const userCity = await this.getCityFromLocation(latitude, longitude);
        await TelegramUserModel.updateOne(
          { chatId: chatId.toString() },
          { $set: { city: userCity } }
        );

        await this.messageService.sendMessage(
          chatId,
          `✅ *¡Ubicación guardada!*\n\n` +
          `🏙️ Tu ciudad: **${userCity}**\n` +
          `📅 Recibirás el pronóstico diario de **${userCity}** a las 06:30`
        );

        await this.showMainButtons(chatId);
      } catch (err) {
        await this.messageService.sendMessage(chatId, "❌ Error procesando ubicación");
      }
    });

    // ✅ 4. COMANDO /clima (clima inmediato)
    this.bot.onText(/\/clima/, async (msg) => {
      const chatId = msg.chat.id;
      await this.sendDailyForecast(chatId);
    });

    // ✅ 5. /stop (OCULTO)
    this.bot.onText(/\/stop/, async (msg) => {
      const chatId = msg.chat.id;
      await TelegramUserModel.updateOne(
        { chatId: chatId.toString() },
        { $set: { subscriptions: [], city: "" } }
      );
      await this.messageService.sendMessage(
        chatId,
        "😢 *Suscripción cancelada.*\nEscribe `/start` para volver."
      );
    });
  }

  private async askForLocation(chatId: number) {
    await this.messageService.sendMessageWithLocationKeyboard(
      chatId,
      "📍 *Comparte tu ubicación para recibir el clima personalizado*"
    );
  }

 private async getCityFromLocation(lat: number, lon: number): Promise<string> {
  return await WeatherLocationService.getCityFromCoordinates(lat, lon);
}

  private async showMainButtons(chatId: number) {
    await this.messageService.sendMessageWithButtons(
      chatId,
      "💡 *¿Qué deseas?*",
      [
        [{ text: "🌤️ Ver Clima Ahora", callback_data: "weather_now" }],
        [{ text: "📱 Más Servicios", callback_data: "more_services" }],
      ]
    );
  }

  private async sendCurrentWeather(chatId: number) {
    try {
      const user = await TelegramUserModel.findOne({ chatId: chatId.toString() }) as ITelegramUser | null;
      const city = user?.city || ConfigService.getConfig().city;

      // Usar clima actual para /clima
      const weather = await this.weatherService.getTodayWeather(city);

      const message = `☀️ *Clima actual en ${city}*:\n\n` +
        `🌤️ ${weather.description}\n` +
        `🌡️ ${weather.temperature}°C\n` +
        `💧 ${weather.humidity}%\n` +
        `⏰ ${new Date().toLocaleTimeString('es-ES')}`;

      await this.messageService.sendMessage(chatId, message);
    } catch (err) {
      await this.messageService.sendMessage(chatId, "❌ Error obteniendo clima");
      console.error("❌ Error clima:", err);
    }
  }

  // Método para enviar pronóstico diario (usado por WeatherCron)
  public async sendDailyForecast(chatId: number) {
    try {
      const user = await TelegramUserModel.findOne({ chatId: chatId.toString() }) as ITelegramUser | null;
      const city = user?.city || ConfigService.getConfig().city;

      const forecast = await this.weatherService.getDailyForecast(city);

      const message = `☀️ *Pronóstico diario para ${city}*:\n\n` +
        forecast
          .map(
            (entry) =>
              `⏰ ${new Date(entry.time * 1000).toLocaleTimeString("es-ES")}: ` +
              `${entry.description}, 🌡️ ${entry.temperature}°C, 💧 ${entry.humidity}%`
          )
          .join("\n");

      await this.messageService.sendMessage(chatId, message);
    } catch (err) {
      await this.messageService.sendMessage(chatId, "❌ Error obteniendo pronóstico");
      console.error("❌ Error pronóstico:", err);
    }
  }
}