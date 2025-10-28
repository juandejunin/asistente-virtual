// import ConfigService from "./ConfigService";

// class WeatherService {
//   private apiKey: string;

//   constructor() {
//     this.apiKey = process.env.OPENWEATHER_API_KEY || "";
//   }

//   public async getTodayWeather(city?: string) {
//     const selectedCity = city || ConfigService.getConfig().city;
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${this.apiKey}&units=metric&lang=es`;

//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`Error al obtener datos del clima: ${response.statusText}`);

//     const data = await response.json();

//     return {
//       description: data.weather[0].description,
//       temperature: data.main.temp,
//       humidity: data.main.humidity,
//     };
//   }
// }

// export default WeatherService;


import ConfigService from "./ConfigService";

interface WeatherData {
  description: string;
  temperature: number;
  humidity: number;
}

interface ForecastEntry {
  time: number; // Timestamp en segundos
  description: string;
  temperature: number;
  humidity: number;
}

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
  }

  public async getTodayWeather(city?: string): Promise<WeatherData> {
    const selectedCity = city || ConfigService.getConfig().city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${this.apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener datos del clima: ${response.statusText}`);

    const data = await response.json();

    return {
      description: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
    };
  }

  public async getDailyForecast(city?: string): Promise<ForecastEntry[]> {
    const selectedCity = city || ConfigService.getConfig().city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${this.apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener pronóstico: ${response.statusText}`);

    const data = await response.json();

    // Filtrar pronósticos para las próximas 24 horas (8 intervalos de 3 horas)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return data.list
      .filter((entry: any) => {
        const entryTime = new Date(entry.dt * 1000);
        return entryTime >= now && entryTime <= tomorrow;
      })
      .map((entry: any) => ({
        time: entry.dt,
        description: entry.weather[0].description,
        temperature: entry.main.temp,
        humidity: entry.main.humidity,
      }));
  }
}

export default WeatherService;