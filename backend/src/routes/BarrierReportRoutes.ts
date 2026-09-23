import { Router } from "express";
import { barrierReportController } from "../controllers/BarrierReportController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();
router.get("/", barrierReportController.list);
router.post("/", barrierReportController.create);
router.post("/:id/review", rbacMiddleware(["inspector", "admin"]), barrierReportController.review);
export default router;
