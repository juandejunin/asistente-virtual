// src/routes/cotizaciones.routes.ts
import { Router } from 'express';
import { CurrencyController } from '../controllers/CurrencyController';

const router = Router();

// GET /api/cotizaciones
router.get("/", CurrencyController.getCotizaciones);

export default router;
