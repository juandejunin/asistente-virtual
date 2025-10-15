// src/scripts/sendWeatherMessage.ts
import WeatherService from '../services/WeatherService';
import TelegramService from '../services/TelegramService';

const weatherService = new WeatherService();
const telegramService = new TelegramService();

async function sendWeatherUpdate() {
  try {
    const weather = await weatherService.getTodayWeather();
    const message = `☀️ Clima en ${process.env.CITY}:
- Estado: ${weather.description}
- Temperatura: ${weather.temperature}°C
- Humedad: ${weather.humidity}%`;

    await telegramService.sendMessage(message);
  } catch (err) {
    console.error('❌ Error enviando clima:', err);
  }
}

sendWeatherUpdate();
