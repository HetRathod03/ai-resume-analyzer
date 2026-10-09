interface Props {
  items: string[];
  tone: "good" | "bad";
}

export default function KeywordChips({ items, tone }: Props) {
  if (!items.length) return <p className="text-sm text-slate-500">None</p>;
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-red-50 text-red-800 border-red-200";
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((k) => (
        <span key={k} className={`px-2.5 py-1 text-sm rounded-md border ${cls}`}>
          {k}
        </span>
      ))}
    </div>
  );
}
