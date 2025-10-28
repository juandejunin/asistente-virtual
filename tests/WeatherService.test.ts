import WeatherService from "../src/services/WeatherService";
import ConfigService from "../src/services/ConfigService";

jest.mock("../src/services/ConfigService");

describe("WeatherService", () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
    (ConfigService.getConfig as jest.Mock).mockReturnValue({ city: "Alburquerque" });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            weather: [{ description: "any" }],
            main: { temp: 0, humidity: 0 },
          }),
      })
    ) as jest.Mock;
  });

  test("getTodayWeather returns correct structure with provided city", async () => {
    const weather = await weatherService.getTodayWeather("Madrid");
    expect(weather).toBeInstanceOf(Object);
    expect(weather).toHaveProperty("description");
    expect(weather).toHaveProperty("temperature");
    expect(weather).toHaveProperty("humidity");
    expect(typeof weather.description).toBe("string");
    expect(typeof weather.temperature).toBe("number");
    expect(typeof weather.humidity).toBe("number");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=Madrid")
    );
  });

  test("getTodayWeather uses default city from ConfigService", async () => {
    const weather = await weatherService.getTodayWeather();
    expect(weather).toBeInstanceOf(Object);
    expect(weather).toHaveProperty("description");
    expect(weather).toHaveProperty("temperature");
    expect(weather).toHaveProperty("humidity");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=Alburquerque")
    );
  });

  test("getTodayWeather throws error for invalid response", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: "City not found",
      })
    );

    await expect(weatherService.getTodayWeather("InvalidCity")).rejects.toThrow(
      "Error al obtener datos del clima: City not found"
    );
  });

  test("getDailyForecast returns forecast for 24 hours", async () => {
    const now = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
    const threeHoursLater = now + 3 * 3600; // 3 horas después
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            list: [
              {
                dt: now + 3600, // 1 hora después para evitar desfases
                weather: [{ description: "soleado" }],
                main: { temp: 20, humidity: 60 },
              },
              {
                dt: threeHoursLater, // 3 horas después
                weather: [{ description: "nublado" }],
                main: { temp: 22, humidity: 65 },
              },
            ],
          }),
      })
    );

    const forecast = await weatherService.getDailyForecast("Madrid");
    expect(forecast).toBeInstanceOf(Array);
    expect(forecast).toHaveLength(2);
    expect(forecast[0]).toHaveProperty("time", now + 3600);
    expect(forecast[0]).toHaveProperty("description", "soleado");
    expect(forecast[0]).toHaveProperty("temperature", 20);
    expect(forecast[0]).toHaveProperty("humidity", 60);
    expect(forecast[1]).toHaveProperty("time", threeHoursLater);
    expect(forecast[1]).toHaveProperty("description", "nublado");
    expect(forecast[1]).toHaveProperty("temperature", 22);
    expect(forecast[1]).toHaveProperty("humidity", 65);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=Madrid")
    );
  });
});