// src/modules/crypto/routes/crypto.routes.ts
import { Router } from 'express';
import { CryptoController } from '../controllers/CryptoController';

// ✅ IGUAL que forex y economy: Named export
export const cryptoRoutes = Router();

// ✅ Usar la constante directamente
cryptoRoutes.get('/top', CryptoController.getTopCryptos);
cryptoRoutes.get('/top5', CryptoController.getTop5);
cryptoRoutes.get('/:id', CryptoController.getCryptoById);



// ✅ Health check (igual que los otros módulos)
cryptoRoutes.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        module: 'crypto',
        timestamp: new Date().toISOString(),
        endpoints: ['/top', '/top5', '/:id', '/convert', '/global', '/health']
    });
});