import { TelegramUserModel } from "../../models/TelegramUser.model";

export class TelegramUserService {
  /**
   * Guarda o actualiza un usuario de Telegram
   */
  async saveOrUpdateUser(chatId: number, firstName: string, lastName?: string, username?: string) {
    try {
      await TelegramUserModel.updateOne(
        { chatId: chatId.toString() }, // 🔹 convertimos a string para Mongo
        { $set: { firstName, lastName, username } },
        { upsert: true }
      );

      console.log(`✅ Usuario guardado o actualizado: ${firstName} (${chatId})`);
    } catch (error) {
      console.error("❌ Error al guardar usuario:", error);
    }
  }

  /**
   * Busca un usuario por chatId
   */
  async findUserByChatId(chatId: number) {
    return await TelegramUserModel.findOne({ chatId: chatId.toString() });
  }

  /**
   * Agrega una suscripción (por ejemplo "weather")
   */
  async addSubscription(chatId: number, service: string) {
    await TelegramUserModel.updateOne(
      { chatId: chatId.toString() },
      { $addToSet: { subscriptions: service } } // 🔹 evita duplicados
    );
  }

  async getSubscribedUsers(service: string) {
    return await TelegramUserModel.find({ 
      subscriptions: { $in: [service] } 
    }).select('chatId firstName');
  }
}
