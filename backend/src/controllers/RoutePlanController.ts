import type { NextFunction, Request, Response } from "express";
import { routePlanService } from "../services/RoutePlanService";
import { createRouteRiskFlowDto } from "../constructors/RoutePlanDtoFactory";
import { ServiceError } from "../utils/ServiceError";

export const routePlanController = {
  list: (_req: Request, res: Response) => res.json(routePlanService.list()),
  create: (req: Request, res: Response) => res.status(201).json(routePlanService.create(req.body)),
  riskFlow: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(createRouteRiskFlowDto(Number(req.params.id)));
    } catch (err) {
      if (err instanceof ServiceError) {
        res.status(err.status).json({ code: err.code, message: err.message, details: err.details });
        return;
      }
      next(err);
    }
  }
};
