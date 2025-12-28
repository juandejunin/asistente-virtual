// // src/modules/forex/services/ForexHistoryService.ts
// import ForexRate from "../../../models/ForexRate";

// export class ForexHistoryService {
//   /**
//    * 📈 Histórico OHLC (para gráficos)
//    */
//   static async getOHLC(currency: string, from?: string, to?: string) {
//     const query: any = { currency };

//     if (from || to) {
//       query.date = {};
//       if (from) query.date.$gte = new Date(from);
//       if (to) query.date.$lte = new Date(to);
//     }

//     return ForexRate.find(query)
//       .sort({ date: 1 })
//       .select("date open high low close -_id")
//       .lean();
//   }

//   /**
//    * 🔼 Tendencia diaria (close hoy vs ayer)
//    */
// static async getDailyTrend(currency: string) {
//     // Últimos 2 días disponibles
//     const rates = await ForexRate.find({ currency })
//       .sort({ date: -1 })
//       .limit(2)
//       .select("date close")
//       .lean();

//     if (rates.length < 2) {
//       return null;
//     }

//     const [today, yesterday] = rates;

//     // Movimiento del par USD/XXX
//     const change = today.close - yesterday.close;
//     const changePercent = (change / yesterday.close) * 100;

//     // Dirección del par (USD/XXX)
//     const pairDirection =
//       change > 0 ? "up" : change < 0 ? "down" : "flat";

//     // Dirección de la moneda consultada (XXX)
//     // Si USD/XXX baja → la moneda se aprecia
//     const currencyDirection =
//       pairDirection === "down"
//         ? "up"
//         : pairDirection === "up"
//         ? "down"
//         : "flat";

//     return {
//       pair: `USD/${currency}`,
//       base: "USD",
//       quote: currency,

//       date: today.date,

//       today: Number(today.close.toFixed(6)),
//       yesterday: Number(yesterday.close.toFixed(6)),

//       change: Number(change.toFixed(6)),
//       changePercent: Number(changePercent.toFixed(4)),

//       pairDirection,
//       currencyDirection,
//     };
//   }
// }

// src/modules/forex/services/ForexHistoryService.ts
import ForexRate from "../../../models/ForexRate";

export class ForexHistoryService {
  /**
   * 📈 Histórico OHLC (para gráficos)
   */
  static async getOHLC(currency: string, from?: string, to?: string) {
    const query: any = { currency };

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    return ForexRate.find(query)
      .sort({ date: 1 })
      .select("date open high low close -_id")
      .lean();
  }

  /**
   * 🔼 Tendencia diaria (close hoy vs ayer)
   */
  static async getDailyTrend(currency: string) {
    const rates = await ForexRate.find({ currency })
      .sort({ date: -1 })
      .limit(2)
      .select("date close")
      .lean();

    if (rates.length < 2) return null;

    const [today, yesterday] = rates;
    const change = today.close - yesterday.close;
    const changePercent = (change / yesterday.close) * 100;

    const pairDirection = change > 0 ? "up" : change < 0 ? "down" : "flat";
    const currencyDirection =
      pairDirection === "down"
        ? "up"
        : pairDirection === "up"
        ? "down"
        : "flat";

    return {
      pair: `USD/${currency}`,
      base: "USD",
      quote: currency,
      date: today.date,
      today: Number(today.close.toFixed(6)),
      yesterday: Number(yesterday.close.toFixed(6)),
      change: Number(change.toFixed(6)),
      changePercent: Number(changePercent.toFixed(4)),
      pairDirection,
      currencyDirection,
    };
  }

  /**
   * 🔹 Obtener cierre de X días atrás (para comparación flexible)
   */
  static async getOHLCForDaysAgo(currency: string, daysAgo: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    const dateStr = targetDate.toISOString().split("T")[0];

    // Buscar el registro más reciente antes o igual a targetDate
    const doc = await ForexRate.findOne({
      currency,
      date: { $lte: dateStr },
    })
      .sort({ date: -1 })
      .lean();

    return doc;
  }
}
