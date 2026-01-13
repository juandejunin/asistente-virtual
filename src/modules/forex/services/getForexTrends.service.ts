import { buildForexTrend } from "../helpers/forexHelpers";
import { ForexTrendWithComparisons } from "../types/forexTrendWithComparisons.type";
import { ForexTrendsResponse, ForexDirection } from "../types";
import { ForexHistoryService } from "./ForexHistoryService";

// Cache de monedas para no golpear la API cada request
let cachedCurrencies: string[] | null = null;
let currenciesCacheTime: number | null = null;
const CURRENCIES_CACHE_TTL = 12 * 3600_000; // 12h

// Cache del response final
let trendsCache: ForexTrendsResponse | null = null;
let trendsCacheTime = 0;
const TRENDS_CACHE_TTL = 5 * 60_000; // 5 min

const getAvailableCurrencies = async (): Promise<string[]> => {
  const now = Date.now();
  if (cachedCurrencies && currenciesCacheTime && now - currenciesCacheTime < CURRENCIES_CACHE_TTL)
    return cachedCurrencies;

  const res = await fetch("https://api.frankfurter.app/currencies");
  if (!res.ok) throw new Error(`Error fetching currencies: ${res.status}`);
  const data = await res.json();
  cachedCurrencies = Object.keys(data).filter((c) => c !== "USD");
  currenciesCacheTime = now;
  return cachedCurrencies;
};

const validateDirection = (value: string): ForexDirection => {
  const valid: ForexDirection[] = ["up", "down", "flat"];
  return valid.includes(value as ForexDirection) ? (value as ForexDirection) : "flat";
};

export const getForexTrends = async (
  compareDays: number[] = [1]
): Promise<ForexTrendsResponse> => {

    const t0 = performance.now();
  const now = Date.now();

  // ✅ Devuelve cache si aún es válida
  if (trendsCache && now - trendsCacheTime < TRENDS_CACHE_TTL) {
    return trendsCache;
  }

 
  const currencies = await getAvailableCurrencies();

  const res = await fetch(
    `https://api.frankfurter.app/latest?from=USD&to=${currencies.join(",")}`
  );
  if (!res.ok) throw new Error(`Error fetching latest rates: ${res.status}`);
  const data = await res.json();

  const availableRates = Object.keys(data.rates);
  const validCurrencies = currencies.filter((c) => availableRates.includes(c));

  // 🔹 Paralelizamos consultas de monedas
  const trendsPromises = validCurrencies.map(async (currency) => {
    const todayRate = data.rates[currency];
    const pastDocsMap = await ForexHistoryService.getOHLCForMultipleDays(currency, compareDays);

    const comparisons = compareDays.map((days) => {
      const pastDoc = pastDocsMap[days];
      const pastRate = pastDoc?.close ?? todayRate;

      const pastDate =
        pastDoc?.date instanceof Date
          ? pastDoc.date.toISOString().split("T")[0]
          : new Date(
              new Date().setDate(new Date().getDate() - days)
            ).toISOString().split("T")[0];

      const change = todayRate - pastRate;
      const changePercent = pastRate !== 0 ? (change / pastRate) * 100 : 0;

      return {
        daysAgo: days,
        date: pastDate,
        rate: pastRate,
        change,
        changePercent,
      };
    });

    const trendBase = buildForexTrend(currency, todayRate, comparisons[0].rate);
    return trendBase ? { ...trendBase, comparisons } : null;
  });

  const trendsUnfiltered = await Promise.all(trendsPromises);
  const trends = trendsUnfiltered.filter(Boolean) as ForexTrendWithComparisons[];

  console.log(
    "⏱️ Backend getForexTrends:",
    (performance.now() - t0).toFixed(0),
    "ms"
  );

  // ✅ Guardamos en cache
  trendsCache = {
    base: "USD",
    updated: data.date,
    trends,
  };
  trendsCacheTime = now;

  return trendsCache;
};
