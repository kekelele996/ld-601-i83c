import type { NextFunction, Request, Response } from "express";
import { assistanceRequestService } from "../services/AssistanceRequestService";
import { createAssistanceAcceptResultDto } from "../constructors/AssistanceRequestDtoFactory";
import { ServiceError } from "../utils/ServiceError";

const wrap = (err: unknown, next: NextFunction, res: Response) => {
  if (err instanceof ServiceError) {
    res.status(err.status).json({ code: err.code, message: err.message, details: err.details });
    return;
  }
  next(err);
};

export const assistanceRequestController = {
  list: (_req: Request, res: Response) => res.json(assistanceRequestService.list()),
  create: (req: Request, res: Response) => res.status(201).json(assistanceRequestService.create(req.body)),
  accept: (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = assistanceRequestService.accept(Number(req.params.id), req.body ?? {});
      res.json(createAssistanceAcceptResultDto(result));
    } catch (err) {
      wrap(err, next, res);
    }
  }
};
