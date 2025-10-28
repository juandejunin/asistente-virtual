import dotenv from "dotenv";
dotenv.config();

export interface WeatherConfig {
  port: string;
  city: string;
  openWeatherApiKey: string;
  telegramToken: string;
  telegramChatId: string;
  baseUrl: string;
  cronSchedule: string; // Añadido
}

export const config: WeatherConfig = {
  port: process.env.PORT || "3000",
  city: process.env.CITY || "Buenos Aires",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  telegramToken: process.env.TELEGRAM_TOKEN || "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
  baseUrl: process.env.BASE_URL || "",
  cronSchedule: process.env.CRON_SCHEDULE || "0 30 6 * * *", // Añadido, por defecto 6:30 AM
};