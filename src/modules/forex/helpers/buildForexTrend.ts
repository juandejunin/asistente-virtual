import { ForexTrend, CurrencyCode, ForexDirection } from "../types";
import { isCurrencyCode } from "../helpers/forexHelpers";


export function buildForexTrend(
  currency: string,
  todayRate: number,
  pastRate: number,
  pairDirectionOverride?: ForexDirection
): ForexTrend | null {
  if (!isCurrencyCode(currency)) return null;
  if (!Number.isFinite(todayRate) || !Number.isFinite(pastRate)) return null;

  const change = todayRate - pastRate;
  const changePercent = pastRate !== 0 ? (change / pastRate) * 100 : 0;

  const pairDirection: ForexDirection =
    pairDirectionOverride ??
    (change > 0 ? "up" : change < 0 ? "down" : "flat");
  const currencyDirection: ForexDirection =
    pairDirection === "down"
      ? "up"
      : pairDirection === "up"
      ? "down"
      : "flat";

  return {
    currency: currency as CurrencyCode,
    today: Number(todayRate.toFixed(6)),
    yesterday: Number(pastRate.toFixed(6)),
    change: Number(change.toFixed(6)),
    changePercent: Number(changePercent.toFixed(4)),
    pairDirection,
    currencyDirection,
  };
}
