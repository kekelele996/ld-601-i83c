import { Router } from "express";
import { assistanceRequestController } from "../controllers/AssistanceRequestController";

const router = Router();
router.get("/", assistanceRequestController.list);
router.post("/", assistanceRequestController.create);
router.post("/:id/accept", assistanceRequestController.accept);
export default router;
