import TelegramBot from "node-telegram-bot-api";

export class TelegramMessageService {
  constructor(private bot: TelegramBot) {}

  // ✅ MÉTODO EXISTENTE
  async sendMessage(chatId: number, text: string) {
    try {
      await this.bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
      console.log("✅ Mensaje enviado:", text.substring(0, 50));
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }
  }

  // 🔥 MÉTODO NUEVO - BOTONES INTERACTIVOS
  async sendMessageWithButtons(chatId: number, text: string, keyboard: any[][]) {
    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: keyboard // ✅ BOTONES INLINE
        }
      });
      console.log("✅ Mensaje con botones enviado");
    } catch (error) {
      console.error("❌ Error enviando botones:", error);
    }
  }
}