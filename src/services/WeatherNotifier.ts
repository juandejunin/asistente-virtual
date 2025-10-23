import WeatherService from "./WeatherService";
import ConfigService from "./ConfigService";
import TelegramBot from "node-telegram-bot-api";
import { TelegramMessageService } from "./Telegram";
import { TelegramUserService } from "./Telegram";

// ✅ CREAR BOT AQUÍ
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: false });

// ✅ PASAR BOT AL CONSTRUCTOR
const weatherService = new WeatherService();
const telegramService = new TelegramMessageService(bot);  // ← ¡ESTO!
const userService = new TelegramUserService();

export async function sendWeatherUpdate() {
  try {
    const weather = await weatherService.getTodayWeather();
    const { city } = ConfigService.getConfig();

    const message = `☀️ *Clima en ${city}*:\n` +
      `🌤️ Estado: ${weather.description}\n` +
      `🌡️ Temperatura: ${weather.temperature}°C\n` +
      `💧 Humedad: ${weather.humidity}%`;

    // ✅ USUARIOS SUSCRITOS
    const users = await userService.getSubscribedUsers("weather");

    if (users.length === 0) {
      console.log("⚠️ No hay usuarios suscritos al clima.");
      return;
    }

    // 📤 ENVÍO MASIVO (PARALELO = MÁS RÁPIDO)
    await Promise.all(
      users.map(user => 
        telegramService.sendMessage(Number(user.chatId), message)
      )
    );

    console.log(`✅ Clima enviado a ${users.length} usuarios`);
  } catch (err) {
    console.error("❌ Error enviando clima:", err);
  }
}