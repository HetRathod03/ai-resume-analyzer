export default function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}
