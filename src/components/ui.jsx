import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      {label}
    </div>
  );
}

export function StatCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          accent ? "text-accent-600" : "text-brand-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="card p-10 text-center text-slate-400">{message}</div>
  );
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg animate-fadeIn rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="btn-outline px-3 py-1 text-sm disabled:opacity-40"
      >
        Prev
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="btn-outline px-3 py-1 text-sm">1</button>
          {start > 2 && <span className="text-slate-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 text-sm font-medium rounded-lg ${
            p === page
              ? "bg-brand-600 text-white"
              : "btn-outline"
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-400">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="btn-outline px-3 py-1 text-sm">{totalPages}</button>
        </>
      )}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="btn-outline px-3 py-1 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    open: "bg-amber-100 text-amber-700",
    resolved: "bg-emerald-100 text-emerald-700",
    paid: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`badge ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
