import { Router } from "express";
import {
  createAnalysis,
  getAnalysis,
  listAnalyses,
} from "../controllers/analysis.controller";
import { uploadResume } from "../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadResume, createAnalysis);
router.get("/", listAnalyses);
router.get("/:id", getAnalysis);

export default router;
