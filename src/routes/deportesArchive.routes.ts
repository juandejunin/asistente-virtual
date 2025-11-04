// src/routes/deportesArchive.routes.ts
import { Router } from 'express';
import { SportsArchiveController } from '../controllers/SportsArchiveController';

const router = Router();

// Lista de ligas
router.get('/leagues', SportsArchiveController.getLeagues);

// Partidos de una liga
router.get('/league/:slug', SportsArchiveController.getLeagueBySlug);

export default router;