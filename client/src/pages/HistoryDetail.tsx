import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAnalysisById } from "../api/analysisApi";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import ResultView from "../components/ResultView";
import type { AnalysisResult } from "../types";

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAnalysisById(id)
      .then(setResult)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading analysis..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ErrorMessage message={error} />
      {result && <ResultView result={result} />}
      <Link to="/history" className="inline-block text-indigo-700 font-medium hover:underline">
        &larr; Back to history
      </Link>
    </div>
  );
}
