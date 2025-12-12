import { Router } from "express";
import { ContactController } from "../controllers/ContactController";
import { validateContact } from "../middlewares/validateContact";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.post("/", validateContact, ContactController.sendMessage);

// Solo usuarios autenticados pueden ver los mensajes
router.get("/messages", authenticateJWT, ContactController.getMessages);

export default router;
