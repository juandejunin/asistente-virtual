import TelegramBot from "node-telegram-bot-api";

export class TelegramMessageService {
  constructor(private bot: TelegramBot) {}

  async sendMessage(chatId: number, text: string) {
    try {
      await this.bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
      console.log("✅ Mensaje enviado");
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }
  }

  async sendMessageWithButtons(chatId: number, text: string, keyboard: any[][]) {
    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
      console.log("✅ Mensaje con botones enviado");
    } catch (error) {
      console.error("❌ Error botones:", error);
    }
  }


async sendMessageWithLocationKeyboard(chatId: number, text: string) {
  await this.bot.sendMessage(chatId, text, {
    reply_markup: {
      keyboard: [
        [
          {
            text: "📍 Enviar Ubicación",
            request_location: true  // 🔥 CLAVE: REQUEST_LOCATION
          }
        ]
      ],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
  console.log("✅ BOTÓN GPS NATIVO ENVIADO!");
}

}