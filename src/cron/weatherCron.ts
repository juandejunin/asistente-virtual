// src/cron/weatherCron.ts
import cron from 'node-cron';
import { sendWeatherUpdate } from '../services/WeatherNotifier';

// Ejemplo: todos los días a las 08:12 AM
cron.schedule('* * * * *', () => {
  console.log('⏰ Enviando actualización del clima a las 08:12...');
  sendWeatherUpdate();
});
