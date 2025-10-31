// src/routes/currency.routes.ts
import { Router } from 'express';
import { CurrencyController } from '../controllers/CurrencyController';

const router = Router();

router.get('/rates', CurrencyController.getRates);

export default router;
