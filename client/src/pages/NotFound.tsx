import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-slate-300">404</h1>
      <p className="mt-2 text-slate-600">This page does not exist.</p>
      <Link to="/" className="inline-block mt-4 text-indigo-700 font-medium hover:underline">
        Go home
      </Link>
    </div>
  );
}
