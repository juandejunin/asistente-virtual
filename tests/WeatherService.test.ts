import WeatherService from "../src/services/WeatherService";

describe("WeatherService", () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
  });

  test("getTodayWeather returns mock weather data", async () => {
    const weather = await weatherService.getTodayWeather();
    expect(weather).toEqual({
      description: "nubes",
      temperature: 19.76,
      humidity: 75
    });
  });
});