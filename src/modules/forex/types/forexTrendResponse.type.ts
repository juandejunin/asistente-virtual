// src/modules/forex/types/forexTrendResponse.type.ts
import { ForexTrend } from "./forexTrend.type";

export interface ForexTrendResponse extends ForexTrend {
  pair: string;              // "USD/BRL"
  base: "USD";
  quote: string;
  date: string;
}
