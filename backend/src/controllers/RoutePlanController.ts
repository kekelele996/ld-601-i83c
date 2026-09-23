import type { NextFunction, Request, Response } from "express";
import { routePlanService } from "../services/RoutePlanService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { createBusinessError } from "../utils/businessError";

export const routePlanController = {
  list: (_req: Request, res: Response) => res.json(routePlanService.list()),
  create: (req: Request, res: Response) => res.status(201).json(routePlanService.create(req.body)),
  flow: (req: Request, res: Response, next: NextFunction) => {
    try {
      const flow = routePlanService.getFlow(Number(req.params.id));
      if (!flow) {
        throw createBusinessError(404, ERROR_CODES.ROUTE_NOT_FOUND, ERROR_MESSAGES.ROUTE_NOT_FOUND);
      }
      res.json(flow);
    } catch (err) {
      next(err);
    }
  }
};
