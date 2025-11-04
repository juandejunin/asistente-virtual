// src/models/SportsLeagueArchive.ts
import mongoose from 'mongoose';

export interface ISportsLeagueArchive extends mongoose.Document {
  date: string;
  league: string;
  matches: {
    home: string;
    away: string;
    homeGoals: string;
    awayGoals: string;
    status: string;
    time: string;
    homeLogo: string;
    awayLogo: string;
  }[];
  fetchedAt: Date;
}

const schema = new mongoose.Schema({
  date: { type: String, required: true },
  league: { type: String, required: true },
  matches: [{
    home: String,
    away: String,
    homeGoals: String,
    awayGoals: String,
    status: String,
    time: String,
    homeLogo: String,
    awayLogo: String,
  }],
  fetchedAt: { type: Date, default: Date.now },
});

// ÍNDICE COMPUESTO ÚNICO: (date + league)
schema.index({ date: 1, league: 1 }, { unique: true });

export const SportsLeagueArchiveModel = mongoose.model<ISportsLeagueArchive>('SportsLeagueArchive', schema);