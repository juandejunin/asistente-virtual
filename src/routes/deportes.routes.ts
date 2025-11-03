// src/routes/deportes.routes.ts
import { Router } from 'express';
import { SportsController } from '../controllers/SportsController';

const router = Router();

router.get("/top", SportsController.getTop);
router.get("/last24", SportsController.getLast24);
router.get("/tournament", SportsController.getTournament);

export default router;