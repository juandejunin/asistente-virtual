import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

    const token = authHeader.split(" ")[1];
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      if (!roles.includes(payload.role)) {
        return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
      }
      req.user = payload; // opcional: guardar info del usuario en request
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
};
