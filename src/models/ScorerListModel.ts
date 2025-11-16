// src/models/ScorerListModel.ts
import mongoose from 'mongoose';

const scorerSchema = new mongoose.Schema({
  player: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    firstName: String,
    lastName: String,
    nationality: String,
  },
  team: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    shortName: String,
    tla: String,
    crest: String,
  },
  goals: { type: Number, required: true },
});

const scorerListSchema = new mongoose.Schema({
  leagueCode: { type: String, required: true },
  season: { type: Number, required: true },
  type: { type: String, enum: ['GOALS', 'YELLOW_CARDS', 'RED_CARDS'], required: true },
  scorers: [scorerSchema],
  fetchedAt: { type: Date, default: Date.now },
});

scorerListSchema.index({ leagueCode: 1, season: 1, type: 1 }, { unique: true });
scorerListSchema.index({ leagueCode: 1, type: 1, fetchedAt: -1 });

export const ScorerListModel = mongoose.model('ScorerList', scorerListSchema);