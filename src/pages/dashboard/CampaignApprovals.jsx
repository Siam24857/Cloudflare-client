import { useEffect, useState } from "react";
import { campaignAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, StatusBadge } from "../../components/ui.jsx";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function CampaignApprovals() {
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () =>
    campaignAPI.pending().then((r) => setList(r.data)).catch(() => setList([]));
  useEffect(load, []);

  const act = async (id, fn) => {
    setBusy(id);
    try {
      await fn(id);
      load();
    } finally {
      setBusy(null);
    }
  };

  if (list === null) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Campaign Approvals" subtitle="Approve or reject pending campaigns." />
      {list.length === 0 ? (
        <EmptyState message="No campaigns awaiting approval." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-700">{c.campaign_title}</td>
                  <td className="px-4 py-3 text-slate-500">{c.creator_name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.category}</td>
                  <td className="px-4 py-3 text-slate-500">{c.funding_goal}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button disabled={busy === c._id}
                        onClick={() => act(c._id, campaignAPI.approve)}
                        className="btn-primary"><FaCheck /> Approve</button>
                      <button disabled={busy === c._id}
                        onClick={() => act(c._id, campaignAPI.reject)}
                        className="btn-danger"><FaTimes /> Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
