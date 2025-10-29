import { Router, Request, Response } from "express";
import ConfigController from "../controllers/ConfigController";

const router = Router();
const controller = new ConfigController();

// Endpoints originales
router.get("/", controller.getConfig);
router.post("/", controller.updateConfig);

// 🔹 Endpoint de prueba para verificar que se carga este archivo
router.get("/test", (req: Request, res: Response) => {
  res.json({
    message: "✅ ConfigRoutes está activo",
    timestamp: new Date().toISOString()
  });
});

export default router;
