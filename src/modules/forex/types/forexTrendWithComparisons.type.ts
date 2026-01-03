// src/modules/forex/types/forexTrendWithComparisons.type.ts
import { ForexTrend } from "./forexTrend.type";

export interface Comparison {
  daysAgo: number;
  date: string;
  rate: number;
  change: number;
  changePercent: number;
}

export interface ForexTrendWithComparisons extends ForexTrend {
  comparisons: Comparison[];
}
