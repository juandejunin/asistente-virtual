import { Router } from "express";
import ConfigController from "../controllers/ConfigController";

const router = Router();
const controller = new ConfigController();

router.get("/", controller.getConfig);
router.post("/", controller.updateConfig);

export default router;
