// src/routes/standings.routes.ts
import { Router } from 'express';
import { LeagueStandingController } from '../controllers/LeagueStandingController';

const router = Router();
const controller = new LeagueStandingController();

// GET /api/deportes/standings/PL
// GET /api/deportes/standings/PD?season=2024
router.get('/:leagueCode', controller.getStandings);

export default router;