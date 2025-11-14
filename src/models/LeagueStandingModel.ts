// src/models/LeagueStandingModel.ts
import mongoose from 'mongoose';

const teamStandingSchema = new mongoose.Schema({
  position: { type: Number, required: true },
  team: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    tla: { type: String, required: true },
    crest: { type: String, required: true },
  },
  playedGames: { type: Number, required: true },
  won: { type: Number, required: true },
  draw: { type: Number, required: true },
  lost: { type: Number, required: true },
  points: { type: Number, required: true },
  goalsFor: { type: Number, required: true },
  goalsAgainst: { type: Number, required: true },
  goalDifference: { type: Number, required: true },
  form: { type: String, default: null },
});

const leagueStandingSchema = new mongoose.Schema({
  leagueCode: { type: String, required: true }, // PL, PD, SA...
  leagueName: { type: String, required: true },
  season: { type: Number, required: true },     // 2025
  currentMatchday: { type: Number, required: true },
  table: [teamStandingSchema],
  fetchedAt: { type: Date, default: Date.now },
});

// Índice único por liga + temporada + jornada
leagueStandingSchema.index(
  { leagueCode: 1, season: 1, currentMatchday: 1 },
  { unique: true }
);

// Índice para búsquedas rápidas (última actualización)
leagueStandingSchema.index({ leagueCode: 1, season: 1, fetchedAt: -1 });

export const LeagueStandingModel = mongoose.model('LeagueStanding', leagueStandingSchema);