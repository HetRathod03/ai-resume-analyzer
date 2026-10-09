import { getPool } from "../config/db";

export interface AnalysisResult {
  score: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
}

export interface AnalysisRecord {
  id: number;
  job_title: string;
  score: number;
  created_at: string;
}

export const AnalysisModel = {
  /** Saves an analysis. Returns the new id, or null if MySQL is not available. */
  async create(jobTitle: string, result: AnalysisResult): Promise<number | null> {
    const pool = getPool();
    if (!pool) return null;
    const [res]: any = await pool.query(
      "INSERT INTO analyses (job_title, score, result) VALUES (?, ?, ?)",
      [jobTitle, result.score, JSON.stringify(result)]
    );
    return res.insertId as number;
  },

  async findRecent(limit = 20): Promise<AnalysisRecord[]> {
    const pool = getPool();
    if (!pool) return [];
    const [rows]: any = await pool.query(
      "SELECT id, job_title, score, created_at FROM analyses ORDER BY id DESC LIMIT ?",
      [limit]
    );
    return rows;
  },

  async findById(
    id: number
  ): Promise<(AnalysisRecord & { result: AnalysisResult }) | null> {
    const pool = getPool();
    if (!pool) return null;
    const [rows]: any = await pool.query(
      "SELECT id, job_title, score, result, created_at FROM analyses WHERE id = ?",
      [id]
    );
    if (!rows.length) return null;
    const row = rows[0];
    // mysql2 usually returns JSON columns already parsed; handle both cases
    const result = typeof row.result === "string" ? JSON.parse(row.result) : row.result;
    return { ...row, result };
  },
};
