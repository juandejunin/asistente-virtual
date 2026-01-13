// src/models/ForexRate.ts
import mongoose from "mongoose";

const ForexRateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  currency: { type: String, required: true },
  open: { type: Number, required: true },
  close: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  base: { type: String, required: true },
});

ForexRateSchema.index({ currency: 1, date: -1 });

const ForexRate = mongoose.model("ForexRate", ForexRateSchema);
export default ForexRate;
