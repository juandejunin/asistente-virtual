// src/models/LeagueSeasonModel.ts
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  leagueId: { type: Number, required: true },
  season: { type: Number, required: true },
  slug: String,
  name: String,
  country: String,
  standings: [mongoose.Schema.Types.Mixed],
  topScorers: [mongoose.Schema.Types.Mixed],
  topAssists: [mongoose.Schema.Types.Mixed],
  fixtures: [mongoose.Schema.Types.Mixed],
  leastConceded: [mongoose.Schema.Types.Mixed],
  fetchedAt: { type: Date, default: Date.now },
});

// ÍNDICE ÚNICO COMPUESTO
schema.index({ leagueId: 1, season: 1 }, { unique: true });

export const LeagueSeasonModel = mongoose.model('LeagueSeason', schema);