import type { NextFunction, Request, Response } from "express";
import { barrierReportService } from "../services/BarrierReportService";
import { createBarrierReviewResultDto } from "../constructors/BarrierReportDtoFactory";
import { ServiceError } from "../utils/ServiceError";

const wrap = (err: unknown, next: NextFunction, res: Response) => {
  if (err instanceof ServiceError) {
    res.status(err.status).json({ code: err.code, message: err.message, details: err.details });
    return;
  }
  next(err);
};

export const barrierReportController = {
  list: (_req: Request, res: Response) => res.json(barrierReportService.list()),
  create: (req: Request, res: Response) => res.status(201).json(barrierReportService.create(req.body)),
  review: (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = barrierReportService.review(Number(req.params.id), req.body ?? {});
      res.json(createBarrierReviewResultDto(result));
    } catch (err) {
      wrap(err, next, res);
    }
  }
};
