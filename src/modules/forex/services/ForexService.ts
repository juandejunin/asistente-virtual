// src/services/forex/ForexService.ts
import NodeCache from "node-cache";
import { ArgentinaService } from "../../argentina/services/ArgentinaService";

const cache = new NodeCache({ stdTTL: 300 });

export class ForexService {
  private static BASE_URL = "https://api.frankfurter.app";

  static async getMajorRates(): Promise<any> {
    const cacheKey = "forex_major";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.BASE_URL}/latest?from=USD`);

      if (!response.ok) {
        throw new Error(`Frankfurter API Error: ${response.status}`);
      }

      const data = await response.json();

      const processedData = {
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        JPY: data.rates.JPY,
        CHF: data.rates.CHF,
        CAD: data.rates.CAD,
        AUD: data.rates.AUD,
        base: data.base,
        updated: data.date,
      };

      cache.set(cacheKey, processedData);
      return processedData;
    } catch (error: unknown) {
      // ✅ SOLUCIÓN: Especificar tipo 'unknown'
      console.error(
        "Error fetching Forex rates from Frankfurter:",
        error instanceof Error ? error.message : String(error)
      );

      const oldCache = cache.get(cacheKey);
      if (oldCache) return oldCache;

      throw new Error("Forex API failed");
    }
  }

  static async getLatinAmericanRates(): Promise<any> {
    const cacheKey = "forex_latinamerica";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.BASE_URL}/latest?from=USD&to=ARS,BRL,MXN,CLP,COP,PEN,UYU`
      );

      if (!response.ok) {
        throw new Error(`Frankfurter LATAM Error: ${response.status}`);
      }

      const data = await response.json();

      const processedData = {
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

      cache.set(cacheKey, processedData, 300);
      return processedData;
    } catch (error: unknown) {
      // ✅ SOLUCIÓN
      console.error(
        "Error fetching Latin American Forex rates:",
        error instanceof Error ? error.message : String(error)
      );

      const oldCache = cache.get(cacheKey);
      if (oldCache) {
        console.log("Using cached Latin American rates due to API failure");
        return oldCache;
      }

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
        _error: "Frankfurter API unavailable, using fallback values",
      };
    }
  }

  static async getAllRates(): Promise<any> {
    const cacheKey = "forex_all";
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log("📊 Returning cached all forex rates");
      return cached;
    }

    try {
      console.log("🔄 Fetching all forex rates...");

      // Llamar a los dos métodos que SÍ existen
      const [major, latam] = await Promise.all([
        this.getMajorRates(),
        this.getLatinAmericanRates(),
      ]);

      const result = {
        major: major,
        latinAmerica: latam,
        timestamp: new Date().toISOString(),
      };

      cache.set(cacheKey, result, 300); // 5 minutos
      console.log("✅ All forex rates fetched successfully");

      return result;
    } catch (error: unknown) {
      console.error("❌ Error in getAllRates:", error);

      const oldCache = cache.get(cacheKey);
      if (oldCache) return oldCache;

      // Fallback si todo falla
      return {
        major: {
          EUR: 0.92,
          GBP: 0.79,
          JPY: 150,
          CHF: 0.88,
          CAD: 1.35,
          AUD: 1.52,
          base: "USD",
          updated: new Date().toISOString().split("T")[0],
          _fallback: true,
        },
        latinAmerica: {
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
        },
        timestamp: new Date().toISOString(),
        _fallback: true,
      };
    }
  }

  static async getCompleteLatinAmericanRates(): Promise<any> {
    const cacheKey = "forex_latam_complete";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      // 1. Obtener tasas de Frankfurter (BRL, MXN, etc.)
      const frankfurterData = await this.getLatinAmericanRates();

      // 2. Obtener dólar argentino de TU API
      const argentinaRates = await this.getArgentinaRates();

      // 3. Combinar todo
      const result = {
        // Monedas de Frankfurter
        BRL: frankfurterData.BRL,
        MXN: frankfurterData.MXN,
        CLP: frankfurterData.CLP || 950,
        COP: frankfurterData.COP || 4000,
        PEN: frankfurterData.PEN || 3.8,
        UYU: frankfurterData.UYU || 40,

        // ✅ AÑADIR ARGENTINA desde tu API
        ARS: argentinaRates.blue || argentinaRates.oficial || 1000,

        // Metadatos de Argentina
        argentina: {
          blue: argentinaRates.blue,
          oficial: argentinaRates.oficial,
          ccl: argentinaRates.ccl,
          mep: argentinaRates.mep,
          tarjeta: argentinaRates.tarjeta,
          lastUpdated: argentinaRates.lastUpdated,
        },

        base: "USD",
        updated: new Date().toISOString().split("T")[0],
        timestamp: new Date().toISOString(),
        sources: {
          latam: "Frankfurter.app",
          argentina: "Tu API local",
        },
      };

      cache.set(cacheKey, result, 180); // 3 minutos (datos volátiles)
      return result;
    } catch (error: unknown) {
      console.error("Error in getCompleteLatinAmericanRates:", error);

      const oldCache = cache.get(cacheKey);
      if (oldCache) return oldCache;

      // Fallback completo
      return {
        BRL: 5.43,
        MXN: 17.96,
        CLP: 950,
        COP: 4000,
        PEN: 3.8,
        UYU: 40,
        ARS: 1000,
        base: "USD",
        updated: new Date().toISOString().split("T")[0],
        _fallback: true,
      };
    }
  }

  // ✅ NUEVO: Obtener tasas de Argentina desde TU API
  private static async getArgentinaRates(): Promise<any> {
    const cacheKey = "argentina_rates";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Usar tu ExchangeService existente
      const data = await ArgentinaService.getDolares();

      // Formatear según la estructura de tu API
      let rates: any = {};

      if (Array.isArray(data)) {
        // Si es array: [{nombre: "Blue", compra: X, venta: Y}, ...]
        data.forEach((dolar: any) => {
          const key = dolar.nombre?.toLowerCase() || dolar.casa?.toLowerCase();
          if (key) {
            rates[key] = {
              compra: dolar.compra,
              venta: dolar.venta,
              nombre: dolar.nombre || dolar.casa,
            };
          }
        });
      } else if (typeof data === "object") {
        // Si es objeto: {blue: X, oficial: Y, ...}
        rates = data;
      }

      const result = {
        blue: rates.blue?.venta || rates.Blue?.venta || 1000,
        oficial: rates.oficial?.venta || rates.Oficial?.venta || 850,
        ccl: rates.ccl?.venta || rates.CCL?.venta || 1100,
        mep: rates.mep?.venta || rates.MEP?.venta || 1080,
        tarjeta: rates.tarjeta?.venta || rates.Tarjeta?.venta || 1400,
        lastUpdated: new Date().toISOString(),
      };

      cache.set(cacheKey, result, 120); // 2 minutos (muy volátil)
      return result;
    } catch (error: unknown) {
      console.error("Error fetching Argentina rates:", error);
      return {
        blue: 1000,
        oficial: 850,
        ccl: 1100,
        mep: 1080,
        tarjeta: 1400,
        lastUpdated: new Date().toISOString(),
        _fallback: true,
      };
    }
  }

  // ✅ NUEVO: Dashboard completo (global + argentina)
  static async getGlobalDashboard(): Promise<any> {
    const cacheKey = "forex_global_dashboard";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const [major, latamComplete, argentina] = await Promise.all([
        this.getMajorRates(),
        this.getCompleteLatinAmericanRates(),
        this.getArgentinaRates(),
      ]);

      const result = {
        global: major,
        latinAmerica: latamComplete,
        argentina: argentina,
        timestamp: new Date().toISOString(),
      };

      cache.set(cacheKey, result, 180);
      return result;
    } catch (error: unknown) {
      console.error("Error in getGlobalDashboard:", error);
      // Fallback simplificado
      return {
        global: { EUR: 0.85, GBP: 0.74, JPY: 155 },
        latinAmerica: { BRL: 5.43, MXN: 17.96, ARS: 1000 },
        argentina: { blue: 1000, oficial: 850 },
        _fallback: true,
      };
    }
  }
}
