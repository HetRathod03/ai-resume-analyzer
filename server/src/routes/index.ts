import { Router } from "express";
import analysisRoutes from "./analysis.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));
router.use("/analyses", analysisRoutes);

export default router;
