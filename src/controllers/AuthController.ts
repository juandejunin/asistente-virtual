import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // versión JS pura con tipos incluidos

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Usuario de ejemplo hardcodeado (en producción, usar base de datos)
const adminUser = {
  username: "admin",
  passwordHash: bcrypt.hashSync("admin123", 10),
};

export class AuthController {
  static login(req: Request, res: Response) {
    const body = req.body || {}; // Aseguramos que body sea un objeto
    const { username, password } = body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son requeridos" });
    }

    // Verificar credenciales
    if (username !== adminUser.username || !bcrypt.compareSync(password, adminUser.passwordHash)) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      token,
      message: "Login exitoso",
    });
  }
}
