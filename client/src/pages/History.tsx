import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory } from "../api/analysisApi";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import { scoreColor } from "../components/ResultView";
import type { HistoryItem } from "../types";

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading history..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Past analyses</h1>
      <ErrorMessage message={error} />

      {!error && items.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No saved analyses yet. History needs MySQL to be configured on the server.
        </div>
      )}

      {items.length > 0 && (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {items.map((h) => (
            <li key={h.id}>
              <Link
                to={`/history/${h.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">{h.job_title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(h.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`font-semibold ${scoreColor(h.score)}`}>{h.score}/100</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
