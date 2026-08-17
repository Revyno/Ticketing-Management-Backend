import { Request, Response, NextFunction } from "express";

// isi createdBy dari user yang login (jangan percaya client kirim createdBy sendiri)
export function setOwner(req: Request, _res: Response, next: NextFunction) {
  if (req.user) req.body.createdBy = req.user.id;
  next();
}
