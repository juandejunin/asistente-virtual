// src/services/forex/ForexService.ts
import NodeCache from "node-cache";
import ForexRate from "../../../models/ForexRate";

const cache = new NodeCache({ stdTTL: 300 });

export class ForexService {
  private static BASE_URL = "https://api.frankfurter.app";
  private static cache = new NodeCache({ stdTTL: 300 });

  static async getMajorRates(): Promise<any> {
    const cacheKey = "forex_major";
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${this.BASE_URL}/latest?from=USD`);
      if (!res.ok) throw new Error(`Frankfurter API Error: ${res.status}`);
      const data = await res.json();

      const processed = {
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        JPY: data.rates.JPY,
        CHF: data.rates.CHF,
        CAD: data.rates.CAD,
        AUD: data.rates.AUD,
        base: data.base,
        updated: data.date,
      };

      this.cache.set(cacheKey, processed);
      return processed;
    } catch (error: unknown) {
      console.error("Error fetching Forex rates from Frankfurter:", error);
      const oldCache = this.cache.get(cacheKey);
      if (oldCache) return oldCache;
      throw new Error("Forex API failed");
    }
  }

  static async getLatinAmericanRates(): Promise<any> {
    const cacheKey = "forex_latinamerica";
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(
        `${this.BASE_URL}/latest?from=USD&to=ARS,BRL,MXN,CLP,COP,PEN,UYU`
      );
      if (!res.ok) throw new Error(`Frankfurter LATAM Error: ${res.status}`);
      const data = await res.json();

      const processed = {
        ARS: data.rates.ARS,
        BRL: data.rates.BRL,
        MXN: data.rates.MXN,
        CLP: data.rates.CLP,
        COP: data.rates.COP,
        PEN: data.rates.PEN,
        UYU: data.rates.UYU,
        base: data.base,
        updated: data.date,
      };

      this.cache.set(cacheKey, processed, 300);
      return processed;
    } catch (error: unknown) {
      console.error("Error fetching Latin American Forex rates:", error);
      const oldCache = this.cache.get(cacheKey);
      if (oldCache) return oldCache;

      // Fallback
      return {
        ARS: 1000,
        BRL: 5.5,
        MXN: 17,
        CLP: 950,
        COP: 4000,
        PEN: 3.8,
        UYU: 40,
        base: "USD",
        updated: new Date().toISOString().split("T")[0],
        _fallback: true,
      };
    }
  }

  static async getAllRates(): Promise<any> {
    const cacheKey = "forex_all";
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const [major, latam] = await Promise.all([
        this.getMajorRates(),
        this.getLatinAmericanRates(),
      ]);

      const result = {
        major,
        latinAmerica: latam,
        timestamp: new Date().toISOString(),
      };
      this.cache.set(cacheKey, result, 300);
      return result;
    } catch (error: unknown) {
      console.error("Error in getAllRates:", error);
      const oldCache = this.cache.get(cacheKey);
      if (oldCache) return oldCache;

      return {
        major: { EUR: 0.85, GBP: 0.74, JPY: 155 },
        latinAmerica: { BRL: 5.43, MXN: 17, ARS: 1000 },
        timestamp: new Date().toISOString(),
        _fallback: true,
      };
    }
  }

  // static async updateDailyOHLC(): Promise<void> {
  //   const today = new Date();
  //   today.setUTCHours(0, 0, 0, 0);

  //   const res = await fetch("https://api.frankfurter.app/latest?from=USD");
  //   if (!res.ok) {
  //     throw new Error(`Frankfurter error ${res.status}`);
  //   }

  //   const data = await res.json();
  //   const rates = data.rates;

  //   for (const [currency, rate] of Object.entries(rates)) {
  //     const existing = await ForexRate.findOne({ date: today, currency });

  //     if (!existing) {
  //       // primera vez del día → open = high = low = close
  //       await ForexRate.create({
  //         date: today,
  //         currency,
  //         base: "USD",
  //         open: rate,
  //         high: rate,
  //         low: rate,
  //         close: rate,
  //       });
  //     } else {
  //       // actualizar máximos / mínimos / cierre
  //       existing.high = Math.max(existing.high, rate as number);
  //       existing.low = Math.min(existing.low, rate as number);
  //       existing.close = rate as number;
  //       await existing.save();
  //     }
  //   }
  // }

  static async updateDailyOHLC(): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  console.log("📅 Fecha OHLC:", today);

  const res = await fetch("https://api.frankfurter.app/latest?from=USD");
  const data = await res.json();

  console.log("📊 Base:", data.base);
  console.log("📊 Date API:", data.date);
  console.log("📊 Rates keys:", Object.keys(data.rates || {}).length);

  const rates = data.rates;

  for (const [currency, rate] of Object.entries(rates)) {
    console.log("➡️ Procesando:", currency, rate);

    const existing = await ForexRate.findOne({ date: today, currency });

    if (!existing) {
      console.log("🆕 Creando registro:", currency);

      await ForexRate.create({
        date: today,
        currency,
        base: "USD",
        open: rate,
        high: rate,
        low: rate,
        close: rate,
      });
    } else {
      console.log("✏️ Actualizando registro:", currency);

      existing.high = Math.max(existing.high, rate as number);
      existing.low = Math.min(existing.low, rate as number);
      existing.close = rate as number;
      await existing.save();
    }
  }

  console.log("✅ updateDailyOHLC finalizado");
}

}
