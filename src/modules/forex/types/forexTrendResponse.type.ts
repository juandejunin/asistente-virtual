// src/modules/forex/types/forexTrendResponse.type.ts
import { CurrencyCode } from "./currencyCode.type";
import { ForexTrend } from "./forexTrend.type";

export interface ForexTrendResponse extends ForexTrend {
  pair: `USD/${CurrencyCode}`;
  base: "USD";
  quote: CurrencyCode;
  date: `${number}-${number}-${number}`; // ISO yyyy-mm-dd

}
