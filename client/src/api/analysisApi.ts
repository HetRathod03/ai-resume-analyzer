import type { AnalysisResult, HistoryItem } from "../types";
import { request } from "./client";

// Empty in local dev (Vite proxy handles /api), set on Vercel to the backend URL
const API = import.meta.env.VITE_API_URL || "";

export const createAnalysis = (form: FormData) =>
  request<AnalysisResult>(`${API}/api/analyses`, { method: "POST", body: form });

export const getHistory = () => request<HistoryItem[]>(`${API}/api/analyses`);

export const getAnalysisById = (id: string) =>
  request<AnalysisResult>(`${API}/api/analyses/${id}`);