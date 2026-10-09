import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAnalysis } from "../api/analysisApi";
import ErrorMessage from "../components/ErrorMessage";
import { useAnalysis } from "../context/AnalysisContext";

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function Home() {
  const navigate = useNavigate();
  const { setResult } = useAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!file && !resumeText.trim()) {
      setError("Upload a PDF resume or paste your resume text.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Paste the job description.");
      return;
    }

    const form = new FormData();
    if (file) form.append("resume", file);
    form.append("resumeText", resumeText);
    form.append("jobTitle", jobTitle);
    form.append("jobDescription", jobDescription);

    setLoading(true);
    try {
      const data = await createAnalysis(form);
      setResult(data);
      navigate("/result");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Check your resume match</h1>
      <p className="text-slate-600 mt-1 mb-6">
        Upload your resume and paste a job description to get an ATS-style score and
        suggestions.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job title</label>
          <input
            className={inputCls}
            placeholder="e.g. Frontend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Resume (PDF, max 5 MB)</label>
          <input
            type="file"
            accept="application/pdf"
            className={inputCls}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-slate-500 mt-1">Or paste the text below.</p>
          <textarea
            className={`${inputCls} mt-2 h-28`}
            placeholder="Paste resume text (used only if no PDF is uploaded)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job description</label>
          <textarea
            className={`${inputCls} h-40`}
            placeholder="Paste the full job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <ErrorMessage message={error} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? "Analyzing your resume..." : "Analyze resume"}
        </button>
      </div>
    </div>
  );
}
