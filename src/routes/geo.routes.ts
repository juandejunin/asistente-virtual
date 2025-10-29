import { Router, Request, Response } from "express";
import geoip from "geoip-lite";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const ip: string = req.ip || "0.0.0.0"; // valor por defecto si es undefined
  const geo = geoip.lookup(ip);

  res.json({
    ip,
    country: geo?.country || "Desconocido",
    region: geo?.region || "Desconocida",
    city: geo?.city || "Desconocida",
  });
});


export default router;
