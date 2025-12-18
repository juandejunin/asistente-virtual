// src/routes/crypto.routes.ts
import { Router } from 'express';
import { CryptoController } from '../controllers/CryptoController';

const router = Router();

// GET /api/crypto/top?limit=10
router.get('/top', CryptoController.getTopCryptos);

// GET /api/crypto/top5
router.get('/top5', CryptoController.getTop5);

// GET /api/crypto/:id (ej: /api/crypto/bitcoin)
router.get('/:id', CryptoController.getCryptoById);

export default router;