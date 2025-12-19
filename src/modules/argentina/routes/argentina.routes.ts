// src/modules/argentina/routes/argentina.routes.ts
import { Router } from 'express';
import { ArgentinaController } from '../controllers/ArgentinaController'; // ← Nombre correcto

// ✅ Misma estructura que otros módulos: export const
export const argentinaRoutes = Router();

// ✅ Ruta principal (igual que tenías)
argentinaRoutes.get("/", ArgentinaController.getCotizaciones);

// ✅ También puedes agregar las otras rutas que mencionamos
argentinaRoutes.get("/cotizaciones", ArgentinaController.getCotizaciones);
argentinaRoutes.get("/dolares", ArgentinaController.getDolares);

// ✅ Health check (opcional, para consistencia)
argentinaRoutes.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        module: "argentina",
        timestamp: new Date().toISOString()
    });
});