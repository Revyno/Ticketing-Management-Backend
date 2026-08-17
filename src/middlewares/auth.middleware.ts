import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

// tambahin req.user ke tipe Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// wajib login: cek header Authorization: Bearer <token>
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  try {
    req.user = verifyToken(header.split(" ")[1]);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
}

// batasi role tertentu (mis. authorize("admin"))
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
