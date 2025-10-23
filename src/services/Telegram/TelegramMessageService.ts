// import TelegramBot from "node-telegram-bot-api";

// export class TelegramMessageService {
//   constructor(private bot: TelegramBot) {}

//   // ✅ MÉTODO EXISTENTE
//   async sendMessage(chatId: number, text: string) {
//     try {
//       await this.bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
//       console.log("✅ Mensaje enviado:", text.substring(0, 50));
//     } catch (error) {
//       console.error("❌ Error enviando mensaje:", error);
//     }
//   }

//   // 🔥 MÉTODO NUEVO - BOTONES INTERACTIVOS
//   async sendMessageWithButtons(chatId: number, text: string, keyboard: any[][]) {
//     try {
//       await this.bot.sendMessage(chatId, text, {
//         parse_mode: "Markdown",
//         reply_markup: {
//           inline_keyboard: keyboard // ✅ BOTONES INLINE
//         }
//       });
//       console.log("✅ Mensaje con botones enviado");
//     } catch (error) {
//       console.error("❌ Error enviando botones:", error);
//     }
//   }

//   async sendMessageWithLocationKeyboard(chatId: number, text: string) {
//     await this.bot.sendMessage(chatId, text, {
//       parse_mode: "Markdown",
//       reply_markup: {
//         keyboard: [[{ text: "📍 Enviar Ubicación" }]],
//         one_time_keyboard: true,
//         resize_keyboard: true
//       }
//     });
//   }
// }


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

  // 🔥 ESTE ES EL QUE HACE EL BOTÓN AZUL
// ✅ MÉTODO CORRECTO - REPLY KEYBOARD
// async sendMessageWithLocationKeyboard(chatId: number, text: string) {
//   await this.bot.sendMessage(chatId, text + "\n\n**📍 TOCA ESTE MENSAJE para enviar ubicación**", {
//     parse_mode: "Markdown",
//     reply_markup: {
//       keyboard: [[{ text: "📍 Enviar Ubicación" }]],
//       one_time_keyboard: true,
//       resize_keyboard: true
//     }
//   });
  
//   // 🔥 ESCUCHAR CLICK EN TEXTO "📍 Enviar Ubicación"
//   this.bot.onText(/📍 Enviar Ubicación/, async (msg) => {
//     if (msg.chat.id === chatId) {
//       await this.bot.sendLocation(chatId, 0, 0); // TRUCO: Fuerza popup GPS
//     }
//   });
// }

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