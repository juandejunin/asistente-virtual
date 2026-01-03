import mongoose from "mongoose";
import dotenv from "dotenv";
import ForexRate from "../models/ForexRate";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/landingPageDB";

const connect = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Conectado a MongoDB");
};

const disconnect = async () => {
  await mongoose.disconnect();
  console.log("🔌 Desconectado de MongoDB");
};

const fetchRatesForDate = async (date: string) => {
  const res = await fetch(
    `https://api.frankfurter.app/${date}?base=USD`
  );
  if (!res.ok) return null;
  return res.json();
};

const populateRecentMissingForex = async () => {
  await connect();

  // 1️⃣ monedas que YA existen en la DB
  const existingCurrencies = await ForexRate.distinct("currency");
  console.log("📦 Monedas existentes:", existingCurrencies.length);

  // 2️⃣ monedas disponibles hoy en Frankfurter
  const currenciesRes = await fetch(
    "https://api.frankfurter.app/currencies"
  );
  const currenciesData = await currenciesRes.json();

  const allCurrencies = Object.keys(currenciesData).filter(
    (c) => c !== "USD"
  );

  // 3️⃣ monedas faltantes
  const missingCurrencies = allCurrencies.filter(
    (c) => !existingCurrencies.includes(c)
  );

  console.log("➕ Monedas a poblar:", missingCurrencies);

  if (missingCurrencies.length === 0) {
    console.log("🎉 No hay monedas faltantes");
    await disconnect();
    return;
  }

  // 4️⃣ rango: último año
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];
    const data = await fetchRatesForDate(dateStr);
    if (!data?.rates) continue;

    for (const currency of missingCurrencies) {
      const rate = data.rates[currency];
      if (!rate) continue;

      const exists = await ForexRate.findOne({
        date: dateStr,
        currency,
      });
      if (exists) continue;

      await ForexRate.create({
        date: dateStr,
        currency,
        base: "USD",
        open: rate,
        close: rate,
        high: rate,
        low: rate,
      });
    }

    console.log(`📅 ${dateStr} procesado`);
  }

  await disconnect();
  console.log("✅ Población reciente completada");
};

populateRecentMissingForex().catch(console.error);
