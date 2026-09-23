import { Router } from "express";
import { routePlanController } from "../controllers/RoutePlanController";

const router = Router();
router.get("/", routePlanController.list);
router.post("/", routePlanController.create);
router.get("/:id/risk-flow", routePlanController.riskFlow);
export default router;
