// // src/services/WeatherNotifier.ts
// import WeatherService from './WeatherService';
// import TelegramService from './TelegramService';

// const weatherService = new WeatherService();
// const telegramService = new TelegramService();

// export async function sendWeatherUpdate() {
//   try {
//     const weather = await weatherService.getTodayWeather();
//     const message = `☀️ Clima en ${process.env.CITY}:
// - Estado: ${weather.description}
// - Temperatura: ${weather.temperature}°C
// - Humedad: ${weather.humidity}%`;

//     await telegramService.sendMessage(message);
//   } catch (err) {
//     console.error('❌ Error enviando clima:', err);
//   }
// }


import WeatherService from "./WeatherService";
import TelegramService from "./TelegramService";
import ConfigService from "./ConfigService";

const weatherService = new WeatherService();
const telegramService = new TelegramService();

export async function sendWeatherUpdate() {
  try {
    const weather = await weatherService.getTodayWeather();
    const { city } = ConfigService.getConfig(); // ✅ ciudad actualizada

    const message = `☀️ Clima en ${city}:
- Estado: ${weather.description}
- Temperatura: ${weather.temperature}°C
- Humedad: ${weather.humidity}%`;

    await telegramService.sendMessage(message);
  } catch (err) {
    console.error("❌ Error enviando clima:", err);
  }
}
