import { buildForexTrend } from "../helpers/forexHelpers";
import { ForexTrendWithComparisons } from "../types/forexTrendWithComparisons.type";
import { ForexTrendsResponse, ForexTrend, ForexDirection } from "../types";
import { ForexHistoryService } from "./ForexHistoryService";

// Cache de monedas para no golpear la API cada request
let cachedCurrencies: string[] | null = null;
let cacheTime: number | null = null;
const CACHE_TTL = 12 * 3600_000; // 12h

const getAvailableCurrencies = async (): Promise<string[]> => {
  const now = Date.now();
  if (cachedCurrencies && cacheTime && now - cacheTime < CACHE_TTL)
    return cachedCurrencies;

  const res = await fetch("https://api.frankfurter.app/currencies");
  if (!res.ok) throw new Error(`Error fetching currencies: ${res.status}`);
  const data = await res.json();
  cachedCurrencies = Object.keys(data).filter((c) => c !== "USD");
  cacheTime = now;
  return cachedCurrencies;
};

const validateDirection = (value: string): ForexDirection => {
  const valid: ForexDirection[] = ["up", "down", "flat"];
  return valid.includes(value as ForexDirection)
    ? (value as ForexDirection)
    : "flat";
};

// export const getForexTrends = async (): Promise<ForexTrendsResponse> => {
//   const currencies = await getAvailableCurrencies();

//   // Fetch de tasas actuales desde Frankfurter
//   const res = await fetch(
//     `https://api.frankfurter.app/latest?from=USD&to=${currencies.join(",")}`
//   );
//   if (!res.ok) throw new Error(`Error fetching latest rates: ${res.status}`);
//   const data = await res.json(); // { base: 'USD', date: '2025-12-23', rates: { EUR: 0.85, JPY: 155.2, ... } }

//   const todayDate = data.date;

//   const trends: ForexTrend[] = await Promise.all(
//     currencies.map(async (currency) => {
//       const todayRate = data.rates[currency];

//       // Obtener el último registro **antes de todayDate** desde la BBDD
//       const previousDocs = await ForexHistoryService.getOHLC(
//         currency,
//         undefined,
//         todayDate
//       );
//       const yesterdayRate =
//         previousDocs.length > 0
//           ? previousDocs[previousDocs.length - 1].close
//           : todayRate;

//       const change = todayRate - yesterdayRate;
//       const changePercent =
//         yesterdayRate !== 0 ? (change / yesterdayRate) * 100 : 0;

//       const pairDirection = change > 0 ? "up" : change < 0 ? "down" : "flat";
//       const currencyDirection =
//         pairDirection === "down"
//           ? "up"
//           : pairDirection === "up"
//           ? "down"
//           : "flat";

//       return {
//         currency,
//         today: Number(todayRate.toFixed(6)),
//         yesterday: Number(yesterdayRate.toFixed(6)),
//         change: Number(change.toFixed(6)),
//         changePercent: Number(changePercent.toFixed(4)),
//         pairDirection: validateDirection(pairDirection),
//         currencyDirection: validateDirection(currencyDirection),
//         todayDate: data.date, // fecha que devuelve la API
//         yesterdayDate:
//           previousDocs.length >= 2
//             ? previousDocs[previousDocs.length - 2].date
//             : data.date,
//       };
//     })
//   );

//   return {
//     base: "USD",
//     updated: new Date().toISOString(),
//     trends,
//   };
// };

export const getForexTrends = async (
  compareDays: number[] = [1]
): Promise<ForexTrendsResponse> => {
  const currencies = await getAvailableCurrencies();
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=USD&to=${currencies.join(",")}`
  );
  if (!res.ok) throw new Error(`Error fetching latest rates: ${res.status}`);
  const data = await res.json();

  // 1️⃣ Filtrar solo monedas que la API realmente devolvió
  const availableRates = Object.keys(data.rates);
  const validCurrencies = currencies.filter((c) => availableRates.includes(c));

  const trends: ForexTrendWithComparisons[] = [];

  for (const currency of validCurrencies) {
    const todayRate = data.rates[currency];

    // 2️⃣ Calculamos comparaciones para cada horizonte de días
    const comparisons = await Promise.all(
      compareDays.map(async (days) => {
        const pastDoc = await ForexHistoryService.getOHLCForDaysAgo(
          currency,
          days
        );
        const pastRate = pastDoc?.close ?? todayRate;
        const pastDate: string =
          pastDoc?.date instanceof Date
            ? pastDoc.date.toISOString().split("T")[0] // convertimos Date → string
            : pastDoc?.date ?? // si ya es string
              new Date(new Date().setDate(new Date().getDate() - days))
                .toISOString()
                .split("T")[0];

        const change = todayRate - pastRate;
        const changePercent = pastRate !== 0 ? (change / pastRate) * 100 : 0;

        return {
          daysAgo: days,
          date: pastDate,
          rate: pastRate,
          change,
          changePercent,
        };
      })
    );

    // 3️⃣ Construimos el trend tipado usando buildForexTrend
    const trendBase = buildForexTrend(currency, todayRate, comparisons[0].rate);

    if (trendBase) {
      trends.push({ ...trendBase, comparisons });
    }
    if (!trendBase) {
      console.log("⛔ Excluida por buildForexTrend:", currency);
      continue;
    }
  }

  return {
    base: "USD",
    updated: data.date, // o new Date().toISOString()
    trends, // trends ya es ForexTrendWithComparisons[]
  };
};
