// src/modules/forex/routes/forex.routes.ts - VERSIÓN CORREGIDA
import { Router } from 'express';
import { ForexController } from '../controllers/ForexController';
import { getForexTrendsController } from '../controllers/getForexTrends.controller';

// ✅ IGUAL que economy: Named export
export const forexRoutes = Router();  // ← CAMBIAR ESTA LÍNEA

// ✅ Usar la constante directamente (igual que economy)
forexRoutes.get('/global', ForexController.getGlobalRates);
forexRoutes.get('/all', ForexController.getAllRates);
forexRoutes.get('/convert', ForexController.convertCurrency);
forexRoutes.get("/trends", getForexTrendsController);


// Opcional: añadir un health check como economy
forexRoutes.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        module: 'forex',
        timestamp: new Date().toISOString()
    });
});