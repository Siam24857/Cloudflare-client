import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
      <img src="/favicon.svg" alt="Clodfare" className="h-16 w-16" />
      <h1 className="text-4xl font-bold text-brand-700">404</h1>
      <p className="text-slate-500">This page wandered off like a lost campaign.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
