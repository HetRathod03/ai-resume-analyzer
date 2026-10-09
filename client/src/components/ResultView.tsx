import type { AnalysisResult } from "../types";
import KeywordChips from "./KeywordChips";

export function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default function ResultView({ result }: { result: AnalysisResult }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      <div>
        <p className="text-sm text-slate-500">{result.jobTitle}</p>
        <div className="flex items-center gap-5 mt-1">
          <div className={`text-6xl font-bold ${scoreColor(result.score)}`}>
            {result.score}
            <span className="text-xl text-slate-400">/100</span>
          </div>
          <p className="text-slate-700">{result.summary}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Matched keywords</h3>
        <KeywordChips items={result.matchedKeywords} tone="good" />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Missing keywords</h3>
        <KeywordChips items={result.missingKeywords} tone="bad" />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Strengths</h3>
        <BulletList items={result.strengths} />
      </div>
      <div>
        <h3 className="font-semibold mb-2">How to improve</h3>
        <BulletList items={result.improvements} />
      </div>
    </div>
  );
}
