import { Router } from "express";
import { ContactController } from "../controllers/ContactController";
import { validateContact } from "../middlewares/validateContact";
import { authenticateJWT } from "../middlewares/auth";
import { contactoRateLimit } from "../middlewares/contactoRateLimit";
import { honeypotContact } from "../middlewares/honeypotContact";

const router = Router();

router.post("/", contactoRateLimit, honeypotContact, validateContact, ContactController.sendMessage);

// Solo usuarios autenticados pueden ver los mensajes
router.get("/messages", authenticateJWT, ContactController.getMessages);

export default router;
