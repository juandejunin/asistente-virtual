// src/services/TelegramService.ts
import 'dotenv/config';

class TelegramService {
  private token: string;
  private chatId: string;

  constructor() {
    this.token = process.env.TELEGRAM_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
  }

  public async sendMessage(text: string) {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: this.chatId, text }),
      });

      const json = await res.json();
      console.log('✅ Mensaje enviado:', json);
    } catch (err) {
      console.error('❌ Error enviando mensaje:', err);
    }
  }
}

export default TelegramService;
