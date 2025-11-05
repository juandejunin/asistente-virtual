class CityService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
    if (!this.apiKey) {
      console.warn("⚠️ Falta OPENWEATHER_API_KEY en el entorno");
    }
  }

  /** 🔍 Buscar ciudades por nombre usando la API de OpenWeather */
  public async searchCities(query: string, limit = 5) {
    if (!query || query.length < 2) return []; // evita llamadas innecesarias

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&limit=${limit}&appid=${this.apiKey}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al buscar ciudades");

    const results = await response.json();
    return results.map((city: any) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    }));
  }
}

export default CityService;
