import TelegramBot from "node-telegram-bot-api";
import WeatherService from "../src/services/WeatherService";
import { TelegramMessageService } from "../src/services/Telegram/TelegramMessageService";
import { TelegramUserService } from "../src/services/Telegram//TelegramUserService";
import ConfigService from "../src/services/ConfigService";

export class TelegramBotService {
  private bot: TelegramBot;
  private weatherService: WeatherService;
  private messageService: TelegramMessageService;
  private userService: TelegramUserService;

  constructor() {
    this.bot = new TelegramBot(ConfigService.getConfig().telegramToken, { polling: true });
    this.weatherService = new WeatherService();
    this.messageService = new TelegramMessageService(this.bot);
    this.userService = new TelegramUserService();
    this.initializeHandlers();
  }

  private initializeHandlers() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.chat.first_name || "Usuario";
      await this.userService.saveOrUpdateUser(chatId, firstName);
      await this.messageService.sendMessageWithButtons(
        chatId,
        `¡Hola ${firstName}! Bienvenid@ al Alburquerque Bot. 😎\n` +
        `Recibirás el pronóstico diario a las 06:30. ` +
        `Por favor, comparte tu ubicación para personalizar tu ciudad.`,
        [[{ text: "🌦️ Clima", callback_data: "weather" }]],
      );
      await this.messageService.sendMessageWithLocationKeyboard(
        chatId,
        "📍 Por favor, envía tu ubicación:"
      );
    });

    this.bot.onText(/\/clima/, async (msg) => {
      const chatId = msg.chat.id;
      const user = await this.userService.getUser(chatId);
      const city = user?.city || ConfigService.getConfig().city;
      const weather = await this.weatherService.getTodayWeather(city);
      const message = `🌦️ *Clima actual en ${city}*:\n` +
        `☁️ ${weather.description}\n` +
        `🌡️ ${weather.temperature}°C\n` +
        `💧 ${weather.humidity}%`;
      await this.messageService.sendMessage(chatId, message);
    });

    this.bot.on("location", async (msg) => {
      const chatId = msg.chat.id;
      const { latitude, longitude } = msg.location!;
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      const city = data[0]?.name || ConfigService.getConfig().city;
      await this.userService.saveOrUpdateUser(chatId, undefined, city);
      await this.messageService.sendMessage(
        chatId,
        `✅ Tu ciudad: **${city}**\nAhora recibirás el pronóstico diario para ${city}.`
      );
      await this.messageService.sendMessageWithButtons(
        chatId,
        "Elige una opción:",
        [[{ text: "🌦️ Clima", callback_data: "weather" }]],
      );
    });

    this.bot.on("callback_query", async (query) => {
      const chatId = query.message!.chat.id;
      if (query.data === "weather") {
        const user = await this.userService.getUser(chatId);
        const city = user?.city || ConfigService.getConfig().city;
        const weather = await this.weatherService.getTodayWeather(city);
        const message = `🌦️ *Clima actual en ${city}*:\n` +
          `☁️ ${weather.description}\n` +
          `🌡️ ${weather.temperature}°C\n` +
          `💧 ${weather.humidity}%`;
        await this.messageService.sendMessage(chatId, message);
      }
    });
  }

  public async sendDailyForecast(chatId: number) {
    const user = await this.userService.getUser(chatId);
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
  }
}

export default TelegramBotService;