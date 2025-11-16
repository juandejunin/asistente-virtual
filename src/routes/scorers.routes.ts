// src/routes/scorers.routes.ts
import { Router } from 'express';
import { ScorerController } from '../controllers/ScorerController';

const router = Router();
const controller = new ScorerController();

router.get('/scorers/:leagueCode', controller.getScorers);
router.get('/cards/yellow/:leagueCode', controller.getScorers);
router.get('/cards/red/:leagueCode', controller.getScorers);

export default router;