import { useEffect, useState } from "react";
import { reportAPI, campaignAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, StatusBadge } from "../../components/ui.jsx";
import { FaBan, FaTrash, FaCheck } from "react-icons/fa";

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    let mounted = true;
    reportAPI.adminAll().then((r) => { if (mounted) setReports(r.data); }).catch(() => { if (mounted) setReports([]); });
    return () => { mounted = false; };
  };
  useEffect(load, []);

  const suspend = async (rep) => {
    setBusy(rep._id);
    try {
      await campaignAPI.suspend(rep.campaign_id);
      await reportAPI.resolve(rep._id);
      load();
    } finally {
      setBusy(null);
    }
  };

  const remove = async (rep) => {
    if (!window.confirm("Delete the reported campaign?")) return;
    setBusy(rep._id);
    try {
      await campaignAPI.adminRemove(rep.campaign_id);
      await reportAPI.resolve(rep._id);
      load();
    } finally {
      setBusy(null);
    }
  };

  const resolve = async (id) => {
    setBusy(id);
    try {
      await reportAPI.resolve(id);
      load();
    } finally {
      setBusy(null);
    }
  };

  if (reports === null) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Reports" subtitle="Campaigns flagged by supporters." />
      {reports.length === 0 ? (
        <EmptyState message="No reports submitted." />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{r.campaign_title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Reported by <b>{r.reporter_name}</b> on {r.date}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <b>Reason:</b> {r.reason}
              </p>
              {r.status === "open" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button disabled={busy === r._id}
                    onClick={() => suspend(r)} className="btn-outline text-amber-700">
                    <FaBan /> Suspend Campaign
                  </button>
                  <button disabled={busy === r._id}
                    onClick={() => remove(r)} className="btn-danger">
                    <FaTrash /> Delete Campaign
                  </button>
                  <button disabled={busy === r._id}
                    onClick={() => resolve(r._id)} className="btn-primary">
                    <FaCheck /> Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
