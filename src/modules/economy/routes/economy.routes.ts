// src/modules/economy/routes/economy.routes.ts
import { Router } from 'express';
import { EconomyController } from '../controllers/EconomyController';

// ✅ CAMBIA esto:
export const economyRoutes = Router();  // Named export

// ✅ Usa la constante directamente:
economyRoutes.get('/global', EconomyController.getGlobalDashboard);
economyRoutes.get('/argentina', EconomyController.getArgentinaDashboard);
economyRoutes.get('/complete', EconomyController.getCompleteDashboard);
economyRoutes.get('/unified-forex', EconomyController.getUnifiedForex);

economyRoutes.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});
