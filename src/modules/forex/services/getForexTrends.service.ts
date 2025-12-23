// src/modules/forex/services/getForexTrends.service.ts
import { ForexTrendsResponse, ForexTrend, ForexDirection } from "../types";
import { ForexHistoryService } from "./ForexHistoryService";

// Cache de monedas para no golpear la API cada request
let cachedCurrencies: string[] | null = null;
let cacheTime: number | null = null;
const CACHE_TTL = 12 * 3600_000; // 12 horas

/**
 * Obtiene la lista de monedas disponibles desde Frankfurter
 */
const getAvailableCurrencies = async (): Promise<string[]> => {
  const now = Date.now();

  if (cachedCurrencies && cacheTime && now - cacheTime < CACHE_TTL) {
    return cachedCurrencies;
  }

  const res = await fetch("https://api.frankfurter.app/currencies");
  if (!res.ok) {
    throw new Error(`Error fetching currencies: ${res.status}`);
  }

  const data = await res.json();
  cachedCurrencies = Object.keys(data).filter(c => c !== "USD"); // excluimos base USD
  cacheTime = now;

  return cachedCurrencies;
};

/**
 * Valida que el string sea un ForexDirection válido
 */
const validateDirection = (value: string): ForexDirection => {
  const valid: ForexDirection[] = ["up", "down", "flat"];
  return valid.includes(value as ForexDirection) ? (value as ForexDirection) : "flat";
};

/**
 * Obtiene todas las tendencias de monedas frente a USD
 */
export const getForexTrends = async (): Promise<ForexTrendsResponse> => {
  const currencies = await getAvailableCurrencies();

  const trends = await Promise.all(
    currencies.map(async (currency): Promise<ForexTrend> => {
      const trendData = await ForexHistoryService.getDailyTrend(currency);

      if (!trendData) {
        // Moneda sin datos → fallback
        return {
          currency,
          today: 0,
          yesterday: 0,
          change: 0,
          changePercent: 0,
          pairDirection: "flat",
          currencyDirection: "flat",
        };
      }

      return {
        currency,
        today: trendData.today,
        yesterday: trendData.yesterday,
        change: trendData.change,
        changePercent: trendData.changePercent,
        pairDirection: validateDirection(trendData.pairDirection),
        currencyDirection: validateDirection(trendData.currencyDirection),
      };
    })
  );

  return {
    base: "USD",
    updated: new Date().toISOString(),
    trends,
  };
};
