import { ForexService } from "../../forex/services/ForexService";
import { ArgentinaService } from "../../argentina/services/ArgentinaService";

export class EconomyAggregator {
  /**
   * Obtiene datos combinados: Forex global + Argentina
   */
  static async getCompleteEconomy() {
    try {
      const [forex, argentina] = await Promise.all([
        ForexService.getAllRates(),
        ArgentinaService.getNormalizedRates(),
      ]);

      return {
        global: forex,
        argentina,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      console.error("Error in EconomyAggregator:", error);
      // fallback simplificado
      return {
        global: { major: {}, latinAmerica: {} },
        argentina: {},
        _fallback: true,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
