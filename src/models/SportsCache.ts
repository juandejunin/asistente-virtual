// src/models/SportsCache.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISportsCache extends Document {
  type: "top" | "last24" | "tournament";
  data: any[];
  updatedAt: Date;
}

const SportsCacheSchema: Schema = new Schema({
  type: { type: String, required: true, unique: true },
  data: { type: [Schema.Types.Mixed], default: [] },
  updatedAt: { type: Date, default: Date.now },
});


export const SportsCacheModel = mongoose.model<ISportsCache>(
  "SportsCache",
  SportsCacheSchema
);
