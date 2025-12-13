import rateLimit from "express-rate-limit";

export const contactoRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 mensajes por IP
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  message: {
    message: "Demasiadas solicitudes. Intentá más tarde."
  }
});
