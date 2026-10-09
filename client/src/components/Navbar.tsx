import { NavLink } from "react-router-dom";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium ${
    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:text-slate-900"
  }`;

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-bold tracking-tight">AI Resume Analyzer</span>
        <div className="flex gap-1">
          <NavLink to="/" end className={linkCls}>
            Analyze
          </NavLink>
          <NavLink to="/history" className={linkCls}>
            History
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
