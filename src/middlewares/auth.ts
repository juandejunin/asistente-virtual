import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Cambiar por un secreto real en producción

export interface AuthRequest extends Request {
  user?: any; // Puedes tipar según tu usuario
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Aquí podemos almacenar el usuario decodificado (por ejemplo, su nombre de usuario)
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expirado, por favor inicie sesión nuevamente." });
    } else {
      return res.status(403).json({ error: "Token inválido o mal formado" });
    }
  }
}

