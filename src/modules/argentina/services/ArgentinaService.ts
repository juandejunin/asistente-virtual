// src/services/ExchangeService.ts
export class ArgentinaService {
  // Variables de entorno para Node
  private static COTIZACIONES_API_URL = process.env.COTIZACIONES_API_URL!;
  private static DOLARES_API_URL = process.env.DOLARES_API_URL!;

  static async getCotizaciones() {
    try {
      const res = await fetch(this.COTIZACIONES_API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error al obtener cotizaciones:", err);
      throw err;
    }
  }

  static async getDolares() {
    try {
      const res = await fetch(this.DOLARES_API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error al obtener dólares:", err);
      throw err;
    }
  }

  static async getNormalizedRates(): Promise<any> {
  try {
    const data = await this.getDolares(); // tu fuente original

    const rates: any = {};
    if (Array.isArray(data)) {
      data.forEach(dolar => {
        const key = (dolar.nombre || dolar.casa)?.toLowerCase();
        if (key) {
          rates[key] = {
            compra: dolar.compra,
            venta: dolar.venta,
            nombre: dolar.nombre || dolar.casa,
          };
        }
      });
    } else if (typeof data === "object") {
      Object.keys(data).forEach(k => {
        rates[k.toLowerCase()] = data[k];
      });
    }

    return {
      blue: rates.blue?.venta || 1000,
      oficial: rates.oficial?.venta || 850,
      ccl: rates.ccl?.venta || 1100,
      mep: rates.mep?.venta || 1080,
      tarjeta: rates.tarjeta?.venta || 1400,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error("Error fetching Argentina normalized rates:", error);
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

}
