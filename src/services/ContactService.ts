import { ContactMessageModel, IContactMessage } from "../models/ContactMessage";

// Tipo para la creación de un mensaje
interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  // Guardar un nuevo mensaje de contacto
  static async saveMessage(data: ContactMessageInput): Promise<IContactMessage> {
    return await ContactMessageModel.create(data);
  }

  // Obtener todos los mensajes de contacto, ordenados por fecha (más recientes primero)
  static async getAllMessages(): Promise<IContactMessage[]> {
    return await ContactMessageModel.find().sort({ createdAt: -1 });
  }
}

export default ContactService;
