// src/routes/dolares.routes.ts
import { Router } from 'express';
import { CurrencyController } from '../controllers/CurrencyController';

const router = Router();

// GET /api/dolares
router.get("/", CurrencyController.getDolares);

export default router;
