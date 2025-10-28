import { Router, Request, Response } from "express";
import geoip from "geoip-lite";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  // Tomar la IP real
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress;
  const geo = geoip.lookup(ip!);

  res.json({
    ip,
    country: geo?.country || "Desconocido",
    region: geo?.region || "Desconocida",
    city: geo?.city || "Desconocida"
  });
});

export default router;
