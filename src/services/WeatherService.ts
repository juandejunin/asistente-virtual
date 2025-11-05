import ConfigService from "./ConfigService";

interface WeatherData {
  city: string;
  country: string;
  description: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pressure: number;
  visibility: number;
}

interface ForecastEntry {
  time: number;
  description: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
}

/** --- NUEVO: Tipos de calidad de aire --- */
interface AirComponents {
  co?: number;
  no?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
  nh3?: number;
}

interface AirQualityData {
  aqi: 1 | 2 | 3 | 4 | 5;
  label: string; // "Buena", "Moderada", etc.
  emoji: string; // "🙂", "😐", etc.
  components: AirComponents;
  timestamp: number; // ms epoch
}

const AQI_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: "Excelente", emoji: "🌿" },
  2: { text: "Buena", emoji: "🙂" },
  3: { text: "Moderada", emoji: "😐" },
  4: { text: "Mala", emoji: "😷" },
  5: { text: "Peligrosa", emoji: "☠️" },
};

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
    if (!this.apiKey) {
      // Opcional: lanza error pronto para no fallar tarde.
      // throw new Error("Falta OPENWEATHER_API_KEY");
    }
  }

  /** ✅ Obtener clima actual (ahora incluye ciudad y país reales) */
  public async getTodayWeather(city?: string): Promise<WeatherData> {
    const selectedCity = city || ConfigService.getConfig().city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      selectedCity
    )}&appid=${this.apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        `Error al obtener datos del clima: ${response.status} ${response.statusText}`
      );

    const data = await response.json();

    return {
      city: data.name ?? selectedCity,
      country: data.sys?.country ?? "Desconocido",
      description: data.weather?.[0]?.description || "Desconocido",
      temperature: data.main?.temp ?? 0,
      feels_like: data.main?.feels_like ?? 0,
      humidity: data.main?.humidity ?? 0,
      wind_speed: data.wind?.speed ?? 0,
      wind_deg: data.wind?.deg ?? 0,
      pressure: data.main?.pressure ?? 0,
      visibility: data.visibility ?? 0,
    };
  }

  public async getDailyForecast(city?: string): Promise<ForecastEntry[]> {
    const selectedCity = city || ConfigService.getConfig().city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      selectedCity
    )}&appid=${this.apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        `Error al obtener pronóstico: ${response.status} ${response.statusText}`
      );

    const data = await response.json();

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return data.list
      .filter((entry: any) => {
        const entryTime = new Date(entry.dt * 1000);
        return entryTime >= now && entryTime <= tomorrow;
      })
      .map((entry: any) => ({
        time: entry.dt,
        description: entry.weather?.[0]?.description ?? "—",
        temperature: entry.main?.temp ?? 0,
        feels_like: entry.main?.feels_like ?? 0,
        humidity: entry.main?.humidity ?? 0,
        wind_speed: entry.wind?.speed ?? 0,
        wind_deg: entry.wind?.deg ?? 0,
      }));
  }

  /** --- NUEVO: obtener calidad de aire por ciudad (internamente resuelve lat/lon) --- */
  public async getAirQualityByCity(city?: string): Promise<AirQualityData> {
    const selectedCity = city || ConfigService.getConfig().city;

    // Reaprovechamos /weather para conseguir coord (evitas otra llamada a geocoding).
    const coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      selectedCity
    )}&appid=${this.apiKey}&lang=es`;
    const coordRes = await fetch(coordUrl);
    if (!coordRes.ok) {
      throw new Error(
        `Error al obtener coordenadas de la ciudad: ${coordRes.status} ${coordRes.statusText}`
      );
    }
    const coordData = await coordRes.json();
    const lat = coordData?.coord?.lat;
    const lon = coordData?.coord?.lon;
    if (typeof lat !== "number" || typeof lon !== "number") {
      throw new Error("No se pudieron resolver coordenadas para la ciudad.");
    }

    return this.getAirQualityByCoords(lat, lon);
  }

  /** --- NUEVO: obtener calidad de aire directamente por coordenadas --- */
  public async getAirQualityByCoords(
    lat: number,
    lon: number
  ): Promise<AirQualityData> {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error al obtener calidad del aire: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    const entry = data?.list?.[0];
    if (!entry?.main?.aqi) {
      throw new Error("Respuesta sin índice AQI.");
    }

    const aqi: 1 | 2 | 3 | 4 | 5 = entry.main.aqi;
    const label = AQI_LABELS[aqi] || { text: "Desconocida", emoji: "❓" };

    return {
      aqi,
      label: label.text,
      emoji: label.emoji,
      components: (entry.components ?? {}) as AirComponents,
      timestamp: (entry.dt ?? 0) * 1000,
    };
  }

  /** --- (Opcional) helper formateado tipo: "🙂 Calidad del aire: Buena (AQI 2)" --- */
  public formatAirQuality(aq: AirQualityData): string {
    return `${aq.emoji} Calidad del aire: ${aq.label} (AQI ${aq.aqi})`;
  }
}

export default WeatherService;
