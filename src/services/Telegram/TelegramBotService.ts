// import TelegramBot from "node-telegram-bot-api";
// import { config } from "../../config";
// import { TelegramMessageService } from "./TelegramMessageService";
// import { TelegramUserService } from "./TelegramUserService";
// import WeatherService from "../WeatherService"; // ✅ IMPORT NORMAL
// import ConfigService from "../ConfigService";   // ✅ IMPORT NORMAL

// export class TelegramBotService {
//   private bot: TelegramBot;
//   private messageService: TelegramMessageService;
//   private userService: TelegramUserService;
//   private weatherService: WeatherService; // ✅ INSTANCIA

//   constructor() {
//     if (!config.telegramToken) throw new Error("❌ Telegram Token faltante!");

//     this.bot = new TelegramBot(config.telegramToken, { polling: true });
//     this.messageService = new TelegramMessageService(this.bot);
//     this.userService = new TelegramUserService();
//     this.weatherService = new WeatherService(); // ✅ CREAR AQUÍ

//     this.initializeHandlers();
//     console.log("🤖 Bot ACTIVO con botones interactivos!");
//   }

//   private initializeHandlers() {
//     // ✅ 1. COMANDO /start
//     this.bot.onText(/\/start/, async (msg) => {
//       const chatId = msg.chat.id;
//       const firstName = msg.chat.first_name || "Usuario";

//       // GUARDAR USUARIO EN DB
//       await this.userService.saveOrUpdateUser(chatId, firstName);

//       // MENSAJE CON BOTONES
//       await this.messageService.sendMessageWithButtons(
//         chatId,
//         `¡Hola ${firstName}! 👋\n\n` +
//         `🌟 *Bienvenido a nuestro servicio de información*\n\n` +
//         `Selecciona el servicio que deseas:`,
//         [
//           [{ text: "☀️ Clima Diario", callback_data: "subscribe_weather" }]
//         ]
//       );
//     });

//     // ✅ 2. CLICK EN BOTÓN
//     this.bot.on("callback_query", async (callbackQuery) => {
//       const chatId = callbackQuery.message?.chat.id!;
//       const data = callbackQuery.data!;

//       // ELIMINAR BOTÓN (UI limpia)
//       await this.bot.answerCallbackQuery(callbackQuery.id);

//       if (data === "subscribe_weather") {
//         // SUSCRIBIR USUARIO
//         await this.userService.addSubscription(chatId, "weather");

//         await this.messageService.sendMessage(
//           chatId,
//           "✅ *¡SUSCRITO AL CLIMA DIARIO!* 🌤️\n\n" +
//           "📅 Recibirás el pronóstico **TODAS LAS MAÑANAS A LAS 8:00 AM**\n\n" +
//           "💡 *Comandos disponibles:*\n" +
//           "`/clima` - Ver clima ahora\n" +
//           "`/stop` - Cancelar suscripción"
//         );
//       }
//     });

//     // ✅ 3. COMANDO /clima (clima inmediato)
//     this.bot.onText(/\/clima/, async (msg) => {
//       const chatId = msg.chat.id;
//       await this.sendCurrentWeather(chatId);
//     });
//   }

//   // ✅ MÉTODO CORREGIDO - SIN IMPORT DINÁMICO
//   private async sendCurrentWeather(chatId: number) {
//     try {
//       const weather = await this.weatherService.getTodayWeather(); // ✅ YA INSTANCIADO
//       const { city } = ConfigService.getConfig();

//       const message = `☀️ *Clima actual en ${city}*:\n\n` +
//         `🌤️ ${weather.description}\n` +
//         `🌡️ ${weather.temperature}°C\n` +
//         `💧 ${weather.humidity}%\n` +
//         `⏰ ${new Date().toLocaleTimeString('es-AR')}`;

//       await this.messageService.sendMessage(chatId, message);
//     } catch (err) {
//       await this.messageService.sendMessage(chatId, "❌ Error obteniendo clima");
//       console.error("❌ Error clima:", err);
//     }
//   }
// }

import TelegramBot from "node-telegram-bot-api";
import { config } from "../../config";
import { TelegramMessageService } from "./TelegramMessageService";
import { TelegramUserService } from "./TelegramUserService";
import WeatherService from "../WeatherService";
import ConfigService from "../ConfigService";
import { TelegramUserModel } from "../../models/TelegramUser.model";

export class TelegramBotService {
  private bot: TelegramBot;
  private messageService: TelegramMessageService;
  private userService: TelegramUserService;
  private weatherService: WeatherService;

  constructor() {
    if (!config.telegramToken) throw new Error("❌ Telegram Token faltante!");

    this.bot = new TelegramBot(config.telegramToken, { polling: true });
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
        await this.sendCurrentWeather(chatId);
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

    // 🔥 3. RECIBIR UBICACIÓN GPS (SOLO UNA VEZ)
// 🔥 DEBUG COORDENADAS - COPIA ESTO
this.bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const { latitude, longitude } = msg.location!;
  
  console.log("🚀 ===== UBICACIÓN RECIBIDA ====");
  console.log("👤 ChatId:", chatId);
  console.log("📍 LAT:", latitude);
  console.log("📍 LON:", longitude);
  console.log("🚀 ===========================");
  
  await this.messageService.sendMessage(
    chatId,
    `🎉 *¡COORDENADAS RECIBIDAS!*\n\n` +
    `🌍 **Lat:** ${latitude}\n` +
    `🌍 **Lon:** ${longitude}\n\n` +
    `✅ *¡FUNCIONA PERFECTO!*`
  );
});

    // ✅ 4. COMANDO /clima
    this.bot.onText(/\/clima/, async (msg) => {
      const chatId = msg.chat.id;
      await this.sendCurrentWeather(chatId);
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

  // 🔥 MÉTODO 1: PEDIR UBICACIÓN
  private async askForLocation(chatId: number) {
    await this.messageService.sendMessageWithLocationKeyboard(
      chatId,
      "📍 *Comparte tu ubicación para recibir el clima personalizado*"
    );
  }

  // 🔥 MÉTODO 2: GPS → CIUDAD (SOLO UNA VEZ)
  private async getCityFromLocation(lat: number, lon: number): Promise<string> {
    const apiKey = process.env.OPENWEATHER_API_KEY!;
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data[0]?.name || "Ciudad desconocida";
  }

  // 🔥 MÉTODO 3: BOTONES PRINCIPALES (SOLO UNA VEZ)
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

  // ✅ CLIMA INMEDIATO (CORREGIDO)
  private async sendCurrentWeather(chatId: number) {
    try {
      const user = await TelegramUserModel.findOne({
        chatId: chatId.toString(),
      });
      const city = user?.city || ConfigService.getConfig().city;

      // ✅ CAMBIAR ESTA LÍNEA - USA getTodayWeather()
      const weather = await this.weatherService.getTodayWeather(city);

      const message =
        `☀️ *Clima actual en ${city}*:\n\n` +
        `🌤️ ${weather.description}\n` +
        `🌡️ ${weather.temperature}°C\n` +
        `💧 ${weather.humidity}%\n` +
        `⏰ ${new Date().toLocaleTimeString("es-ES")}`;

      await this.messageService.sendMessage(chatId, message);
    } catch (err) {
      await this.messageService.sendMessage(
        chatId,
        "❌ Error obteniendo clima"
      );
      console.error("❌ Error clima:", err);
    }
  }
}
