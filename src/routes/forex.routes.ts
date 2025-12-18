// src/routes/forex.routes.ts
import { Router } from 'express';
import { ForexController } from '../controllers/ForexController';

const router = Router();
router.get('/global', ForexController.getGlobalRates);


// GET /api/forex/all - Todo combinado (AHORA SÍ funciona)
router.get('/all', ForexController.getAllRates);

// GET /api/forex/convert - Conversor de divisas ✅ AÑADE ESTA LÍNEA
router.get('/convert', ForexController.convertCurrency);
export default router;