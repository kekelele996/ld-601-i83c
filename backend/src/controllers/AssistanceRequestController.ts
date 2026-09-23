import type { NextFunction, Request, Response } from "express";
import { assistanceRequestService } from "../services/AssistanceRequestService";

export const assistanceRequestController = {
  list: (_req: Request, res: Response) => res.json(assistanceRequestService.list()),
  create: (req: Request, res: Response) => res.status(201).json(assistanceRequestService.create(req.body)),
  accept: (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = (req as unknown as { user?: { id?: number } }).user ?? { id: 1 };
      res.json(assistanceRequestService.accept(Number(req.params.id), { id: Number(actor.id ?? 1) }));
    } catch (err) {
      next(err);
    }
  }
};
