import type { NextFunction, Request, Response } from "express";
import { barrierReportService } from "../services/BarrierReportService";

export const barrierReportController = {
  list: (_req: Request, res: Response) => res.json(barrierReportService.list()),
  create: (req: Request, res: Response) => res.status(201).json(barrierReportService.create(req.body)),
  review: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(barrierReportService.review(Number(req.params.id), String(req.body?.action ?? "")));
    } catch (err) {
      next(err);
    }
  }
};
