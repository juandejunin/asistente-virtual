// /lib/types/forex.ts
import { z } from "zod";

//
// 1️⃣ Tipos de monedas
//

// Nombre de las monedas
export const currencyNames = {
  AUD: "Dólar australiano",
  BGN: "Lev búlgaro",
  BRL: "Real brasileño",
  CAD: "Dólar canadiense",
  CHF: "Franco suizo",
  CNY: "Yuan chino",
  CLP: "Peso chileno",
  COP: "Peso colombiano",
  CZK: "Corona checa",
  DKK: "Corona danesa",
  EUR: "Euro",
  GBP: "Libra esterlina",
  HKD: "Dólar de Hong Kong",
  HUF: "Forinto húngaro",
  IDR: "Rupia indonesia",
  ILS: "Shekel israelí",
  INR: "Rupia india",
  ISK: "Corona islandesa",
  JPY: "Yen japonés",
  KRW: "Won surcoreano",
  MXN: "Peso mexicano",
  MYR: "Ringgit malayo",
  NOK: "Corona noruega",
  NZD: "Dólar neozelandés",
  PEN: "Sol peruano",
  PHP: "Peso filipino",
  PLN: "Złoty polaco",
  RON: "Leu rumano",
  SEK: "Corona sueca",
  SGD: "Dólar de Singapur",
  THB: "Baht tailandés",
  TRY: "Lira turca",
  UYU: "Peso uruguayo",
  ZAR: "Rand sudafricano",
} as const;

// Tipo de moneda (keys del objeto)
export type CurrencyCode = keyof typeof currencyNames;

// Lista oficial de todas las monedas
export const currencyList: CurrencyCode[] = Object.keys(currencyNames) as CurrencyCode[];

// Zod enum para validación runtime
export const CurrencyCodeSchema = z.enum(currencyList);

//
// 2️⃣ Tipos y schemas de ForexTrend
//

export interface ForexTrendComparison {
  daysAgo: number;
  date: string; // ISO string
  rate: number;
}

export const ForexTrendComparisonSchema = z.object({
  daysAgo: z.number(),
  date: z.string(),
  rate: z.number(),
});

export interface ForexTrend {
  currency: CurrencyCode;
  today: number;
  comparisons: ForexTrendComparison[];
}

export const ForexTrendSchema = z.object({
  currency: CurrencyCodeSchema,
  today: z.number(),
  comparisons: z.array(ForexTrendComparisonSchema),
});

//
// 3️⃣ Schema completo de respuesta del backend
//

export interface ForexTrendsResponse {
  base: string;        // moneda base, ej. "USD"
  updated: string;     // fecha de actualización
  trends: ForexTrend[]; // array de tendencias
}

export const ForexTrendsResponseSchema = z.object({
  base: z.string(),
  updated: z.string(),
  trends: z.array(ForexTrendSchema),
});
