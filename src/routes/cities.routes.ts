import { Router } from "express";
import { CityController } from "../controllers/CityController";

const router = Router();
const controller = new CityController();

router.get("/", controller.searchCities);

export default router;
