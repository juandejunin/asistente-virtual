import ConfigService from "./ConfigService";

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
  }

  public async getTodayWeather() {
    const { city } = ConfigService.getConfig(); // 👈 se toma dinámicamente
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener datos del clima: ${response.statusText}`);

    const data = await response.json();

    return {
      description: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
    };
  }
}

export default WeatherService;
