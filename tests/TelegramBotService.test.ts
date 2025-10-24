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
            weather: [{ description: "nubes" }],
            main: { temp: 20.32, humidity: 75 },
          }),
      })
    ) as jest.Mock;
  });

  test("getTodayWeather returns mock weather data", async () => {
    const weather = await weatherService.getTodayWeather();
    expect(weather).toEqual({
      description: "nubes",
      temperature: 20.32,
      humidity: 75,
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=Alburquerque")
    );
  });

  test("getTodayWeather throws error for invalid city", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: "City not found",
      })
    );

    await expect(weatherService.getTodayWeather()).rejects.toThrow(
      "Error al obtener datos del clima: City not found"
    );
  });
});