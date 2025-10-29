import { Router, Request, Response } from "express";
import geoip from "geoip-lite";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  // Detectar IP real incluso detrás de proxy
  let ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "IP desconocida";

  // Si viene con prefijo "::ffff:", lo limpiamos
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  const geo = geoip.lookup(ip);

  res.json({
    ip,
    country: geo?.country || "Desconocido",
    region: geo?.region || "Desconocida",
    city: geo?.city || "Desconocida",
  });
});

export default router;
