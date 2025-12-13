import { Request, Response } from "express";
import ContactService from "../services/ContactService";

export class ContactController {

    static async getMessages(req: Request, res: Response) {
        try {
            const messages = await ContactService.getAllMessages();
            return res.json({
                success: true,
                data: messages,
            });
        } catch (error) {
            console.error("Error en getMessages:", error);
            return res.status(500).json({ error: "Error del servidor" });
        }
    }

    static async sendMessage(req: Request, res: Response) {
        try {
            // Verificar que req.body exista
            if (!req.body || typeof req.body !== "object") {
                return res.status(400).json({
                    error: "Cuerpo de la petición inválido o vacío",
                });
            }

            const { name, email, message } = req.body;

            // Verificar que todos los campos estén presentes
            if (!name || !email || !message) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios",
                });
            }

            // Guardar el mensaje en la base de datos
            const savedMessage = await ContactService.saveMessage({ name, email, message });

            console.log("Nuevo mensaje de contacto guardado:", savedMessage);

            return res.status(201).json({
                success: true,
                message: "Mensaje enviado correctamente.",
                data: savedMessage, // Devuelve _id, name, email, message y createdAt
            });

        } catch (error) {
            console.error("Error en sendMessage:", error);
            return res.status(500).json({
                error: "Error del servidor",
            });
        }
    }
}
