export class WeatherLocationService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY!;
  }

  async getCityFromCoordinates(lat: number, lon: number): Promise<string> {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error obteniendo ciudad: ${res.statusText}`);

    const data = await res.json();
    return data[0]?.name || "Ciudad desconocida";
  }

  async getCoordinatesFromCity(city: string): Promise<{ lat: number; lon: number }> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error obteniendo coordenadas: ${res.statusText}`);

    const data = await res.json();
    return { lat: data[0]?.lat, lon: data[0]?.lon };
  }
}

export default new WeatherLocationService();
