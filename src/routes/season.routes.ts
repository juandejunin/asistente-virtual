// src/routes/season.routes.ts
import { Router } from 'express';
import { SeasonController } from '../controllers/SeasonController';

const router = Router();

// Lista de ligas
router.get('/', SeasonController.getLeagues);

// Datos por slug
router.get('/:slug', SeasonController.getBySlug);

export default router;