import { env } from "../config/env";
import { AnalysisResult } from "../models/analysis.model";
import { ApiError } from "../utils/ApiError";

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) and technical recruiter.
Compare the resume against the job description and respond with ONLY valid JSON, no markdown, in this exact shape:
{
  "score": number between 0 and 100,
  "summary": "2 sentence overall assessment",
  "matchedKeywords": ["skills/keywords present in both"],
  "missingKeywords": ["important keywords from the job description text that are missing from the resume"],
  "strengths": ["3-5 short points"],
  "improvements": ["3-5 specific, actionable suggestions"]
}`;

// If one model is busy or unavailable, the next one is tried automatically
const MODELS = Array.from(
  new Set([env.aiModel, "gemini-3.5-flash-lite", "gemini-3-flash-preview", "gemini-flash-latest"])
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callGemini(model: string, body: string): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.geminiApiKey,
    },
    body,
  });
}

export async function analyzeResume(
  resume: string,
  jobDescription: string
): Promise<AnalysisResult> {
  if (!env.geminiApiKey) {
    throw new ApiError(500, "GEMINI_API_KEY is not set in server/.env");
  }

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `RESUME:\n${resume.slice(0, 12000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 6000)}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 4096,
    },
  });

  let response: Response | null = null;

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      response = await callGemini(model, body);
      if (response.ok) {
        console.log("Model used:", model);
        break;
      }
      console.log(`Model ${model} failed with ${response.status} (attempt ${attempt})`);
      // Busy server: wait briefly and retry the same model once
      if (response.status === 503 && attempt === 1) {
        await sleep(2000);
        continue;
      }
      break;
    }
    if (response?.ok) break;
    // Busy, rate limited or model not found -> try the next model. Other errors stop here.
    if (![503, 429, 404].includes(response!.status)) break;
  }

  if (!response || !response.ok) {
    const status = response?.status ?? 502;
    if (status === 503 || status === 429) {
      throw new ApiError(503, "Gemini is busy right now. Please wait a minute and try again.");
    }
    throw new ApiError(502, `AI API error (${status}): ${response ? await response.text() : ""}`);
  }

  const data: any = await response.json();
  const text: string = (data.candidates?.[0]?.content?.parts || [])
    .map((p: any) => p.text || "")
    .join("");

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as AnalysisResult;
    parsed.score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    parsed.matchedKeywords ||= [];
    parsed.missingKeywords ||= [];
    parsed.strengths ||= [];
    parsed.improvements ||= [];
    return parsed;
  } catch {
    throw new ApiError(502, "AI returned an unreadable response. Please try again.");
  }
}