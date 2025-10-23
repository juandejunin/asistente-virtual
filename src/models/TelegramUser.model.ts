import mongoose, { Schema, Document } from "mongoose";

export interface ITelegramUser extends Document {
  chatId: string; // 🔹 se guarda como string (más seguro para IDs largos)
  firstName: string;
  lastName?: string;
  username?: string;
  subscriptions: string[];
  createdAt: Date;
}


const TelegramUserSchema: Schema = new Schema({
  chatId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String },
  subscriptions: { type: [String], default: [] },
  city: { type: String, default: "" },  // 🔥 NUEVO
  createdAt: { type: Date, default: Date.now },
});

export const TelegramUserModel = mongoose.model<ITelegramUser>(
  "TelegramUser",
  TelegramUserSchema
);
