// src/modules/forex/types/forexTrend.type.ts
import { ForexDirection } from "./forexDirection.type";
import { CurrencyCode } from "./currencyCode.type";


export interface ForexTrend {
  currency: CurrencyCode;          // "EUR", "BRL", etc.
  today: number;             // precio actual
  yesterday: number;         // precio día anterior
  change: number;            // today - yesterday
  changePercent: number;     // %
  pairDirection: ForexDirection;
  currencyDirection: ForexDirection;
}
