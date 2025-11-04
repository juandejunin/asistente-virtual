// src/models/SportsFullArchive.ts
import mongoose from 'mongoose';

export interface ISportsFullArchive extends mongoose.Document {
  date: string;
  fixtures: any[]; // raw de API-Sports
  fetchedAt: Date;
}

const schema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  fixtures: { type: [mongoose.Schema.Types.Mixed], required: true },
  fetchedAt: { type: Date, default: Date.now },
});

export const SportsFullArchiveModel = mongoose.model<ISportsFullArchive>('SportsFullArchive', schema);