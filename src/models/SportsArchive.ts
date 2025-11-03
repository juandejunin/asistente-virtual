import mongoose, { Schema, Document } from "mongoose";

export interface ISportsArchive extends Document {
  type: "top" | "last24" | "tournament";
  data: any[];
  createdAt: Date;
}

const SportsArchiveSchema: Schema = new Schema({
  type: { type: String, required: true },
  data: { type: [Schema.Types.Mixed], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SportsArchiveModel = mongoose.model<ISportsArchive>(
  "SportsArchive",
  SportsArchiveSchema
);
