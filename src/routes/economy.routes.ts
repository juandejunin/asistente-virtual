// src/routes/economy.routes.ts
import { Router } from 'express';
import { EconomyController } from '../controllers/EconomyController';

const router = Router();

// Dashboard global (Forex + Crypto)
router.get('/global', EconomyController.getGlobalDashboard);

// Dashboard Argentina (tus servicios)
router.get('/argentina', EconomyController.getArgentinaDashboard);

// Dashboard completo (todo junto)
router.get('/complete', EconomyController.getCompleteDashboard);

// Forex unificado (global + ARS integrado)
router.get('/unified-forex', EconomyController.getUnifiedForex);

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

export default router;