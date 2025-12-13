// Esto es lo único que necesitás

import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: 'admin' | 'super_admin';
        // si también guardás id, iat, exp, etc., podés agregarlos acá
        id?: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}