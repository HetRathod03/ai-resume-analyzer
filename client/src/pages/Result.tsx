import { Link, Navigate } from "react-router-dom";
import ResultView from "../components/ResultView";
import { useAnalysis } from "../context/AnalysisContext";

export default function Result() {
  const { result } = useAnalysis();

  // Page refreshed or opened directly -> nothing to show, go back to the form
  if (!result) return <Navigate to="/" replace />;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ResultView result={result} />
      <Link to="/" className="inline-block text-indigo-700 font-medium hover:underline">
        &larr; Analyze another resume
      </Link>
    </div>
  );
}
