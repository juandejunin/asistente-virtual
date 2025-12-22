// src/scripts/populateForex.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

import ForexRate from "../models/ForexRate";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/landingPageDB";

// Conexión a MongoDB
const connectToDatabase = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Conectado a MongoDB");
};

// Desconexión de MongoDB
const disconnectFromDatabase = async () => {
  await mongoose.disconnect();
  console.log("Desconectado de MongoDB");
};

// Función para generar fechas entre dos fechas
const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Función para obtener datos de Frankfurter
const fetchRatesForDate = async (date: string) => {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/${date}?base=USD`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error fetching rates for ${date}:`, err);
    return null;
  }
};

// Función principal
const populateForex = async () => {
  await connectToDatabase();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 10); // últimos 10 años

  const dates = getDatesBetween(startDate, endDate);

  console.log(`Generando cotizaciones para ${dates.length} días`);

  for (const date of dates) {
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const data = await fetchRatesForDate(dateStr);

    if (!data) continue;

    const base = data.base;
    const rates = data.rates;

    // Guardar cada moneda como un documento
    for (const [currency, rate] of Object.entries(rates)) {
      const existing = await ForexRate.findOne({ date: dateStr, currency });
      if (existing) continue; // evita duplicados

      // Como Frankfurter solo da un valor, usamos el mismo para open, close, high, low
      const forexDoc = new ForexRate({
        date: dateStr,
        currency,
        base,
        open: rate,
        close: rate,
        high: rate,
        low: rate,
      });

      await forexDoc.save();
    }

    console.log(`Guardado ${Object.keys(rates).length} cotizaciones para ${dateStr}`);
  }

  await disconnectFromDatabase();
  console.log("Proceso completado");
};

// Ejecutar script
populateForex().catch((err) => {
  console.error("Error en populateForex:", err);
});
