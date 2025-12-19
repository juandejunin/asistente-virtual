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
}
