import { Request, Response, NextFunction } from "express";

/**
 * Honeypot invisible para formularios de contacto
 * Si el campo oculto viene completo → bot
 */
export function honeypotContact(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body?.company) {
    // Respuesta silenciosa para bots
    return res.status(200).json({ ok: true });
  }

  next();
}
