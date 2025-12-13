import { Request, Response, NextFunction } from "express";

/**
 * Middleware de protección usando cookie técnica para formulario de contacto
 *
 * Flujo:
 * - Si existe la cookie `contact_fp`, el usuario es confiable → se puede usar para
 *   ajustar el rate limit o solo marcarlo internamente
 * - Si no existe → cae en el rate limit normal
 */
export function contactCookieGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookieFp = req.cookies?.contact_fp;

  if (cookieFp) {
    // Usuario con cookie técnica
    // Opcional: almacenar en request para uso interno (logs, métricas, etc.)
    req.body._cookieFp = cookieFp;
  }

  // Siguiente middleware: honeypot / validate / controller
  next();
}
