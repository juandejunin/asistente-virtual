// src/modules/forex/types/forexTrendsResponse.type.ts
import { ForexTrend } from "./forexTrend.type";

export interface ForexTrendsResponse {
  base: "USD";
  updated: string;
  trends: ForexTrend[];
}
