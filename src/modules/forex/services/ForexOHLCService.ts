import ForexRate from "../../../models/ForexRate";

export class ForexOHLCService {
  static async updateDailyOHLC(currency: string, price: number) {
    const today = new Date().toISOString().split("T")[0];

    const existing = await ForexRate.findOne({ date: today, currency });

    if (!existing) {
      // Primera cotización del día → OPEN
      await ForexRate.create({
        date: today,
        currency,
        base: "USD",
        open: price,
        high: price,
        low: price,
        close: price,
      });
      return;
    }

    // Actualizar HIGH / LOW / CLOSE
    existing.high = Math.max(existing.high, price);
    existing.low = Math.min(existing.low, price);
    existing.close = price;

    await existing.save();
  }
}
