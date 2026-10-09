import type { AnalysisResult, HistoryItem } from "../types";
import { request } from "./client";

export const createAnalysis = (form: FormData) =>
  request<AnalysisResult>("/api/analyses", { method: "POST", body: form });

export const getHistory = () => request<HistoryItem[]>("/api/analyses");

export const getAnalysisById = (id: string) =>
  request<AnalysisResult>(`/api/analyses/${id}`);
