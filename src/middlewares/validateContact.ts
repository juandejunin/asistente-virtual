import { Request, Response, NextFunction } from "express";

// Validación básica de los campos
export function validateContact(req: Request, res: Response, next: NextFunction) {
  const { name, email, message } = req.body;

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Cuerpo de la petición inválido o vacío" });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validación de formato de email simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  // Validación de longitud de campos (opcional)
  if (name.length > 100) {
    return res.status(400).json({ error: "El nombre es demasiado largo" });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: "El mensaje es demasiado largo" });
  }

  // Todos los checks pasaron
  next();
}
