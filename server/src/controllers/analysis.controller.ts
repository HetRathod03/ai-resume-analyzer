import { Request, Response } from "express";
import { AnalysisModel } from "../models/analysis.model";
import { analyzeResume } from "../services/ai.service";
import { extractTextFromPdf } from "../services/pdf.service";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

/** POST /api/analyses  (multipart: resume PDF or resumeText, jobTitle, jobDescription) */
export const createAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const jobDescription = String(req.body.jobDescription || "").trim();
  const jobTitle = String(req.body.jobTitle || "").trim() || "Untitled role";
  let resumeText = String(req.body.resumeText || "").trim();

  if (req.file) {
    resumeText = await extractTextFromPdf(req.file.buffer);
  }

  if (!resumeText) throw new ApiError(400, "Upload a PDF or paste your resume text");
  if (!jobDescription) throw new ApiError(400, "Job description is required");

  const result = await analyzeResume(resumeText, jobDescription);
  const id = await AnalysisModel.create(jobTitle, result).catch((e) => {
    console.error("Could not save analysis:", e.message);
    return null;
  });

  res.status(201).json({ id, jobTitle, ...result });
});

/** GET /api/analyses */
export const listAnalyses = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await AnalysisModel.findRecent(20));
});

/** GET /api/analyses/:id */
export const getAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new ApiError(400, "Invalid id");

  const record = await AnalysisModel.findById(id);
  if (!record) throw new ApiError(404, "Analysis not found");

  res.json({ id: record.id, jobTitle: record.job_title, ...record.result });
});
