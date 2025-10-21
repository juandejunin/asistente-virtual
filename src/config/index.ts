import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || "3000",
  city: process.env.CITY || "Buenos Aires",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  telegramToken: process.env.TELEGRAM_TOKEN || "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
};
