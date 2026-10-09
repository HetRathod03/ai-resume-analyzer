export interface AnalysisResult {
  id: number | null;
  jobTitle: string;
  score: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
}

export interface HistoryItem {
  id: number;
  job_title: string;
  score: number;
  created_at: string;
}
