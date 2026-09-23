import { Router } from "express";
import { assistanceRequestController } from "../controllers/AssistanceRequestController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();
router.get("/", assistanceRequestController.list);
router.post("/", assistanceRequestController.create);
router.post("/:id/accept", rbacMiddleware(["dispatcher", "volunteer", "admin"]), assistanceRequestController.accept);
export default router;
