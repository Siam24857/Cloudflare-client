import { useEffect, useState } from "react";
import { campaignAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, StatusBadge } from "../../components/ui.jsx";
import { FaTrash } from "react-icons/fa";

export default function ManageCampaigns() {
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () =>
    campaignAPI.adminAll().then((r) => setList(r.data)).catch(() => setList([]));
  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this campaign permanently?")) return;
    setBusy(id);
    try {
      await campaignAPI.adminRemove(id);
      load();
    } finally {
      setBusy(null);
    }
  };

  if (list === null) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Manage Campaigns" subtitle="All campaigns on the platform." />
      {list.length === 0 ? (
        <EmptyState message="No campaigns yet." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Raised / Goal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-700">{c.campaign_title}</td>
                  <td className="px-4 py-3 text-slate-500">{c.creator_name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {c.amount_raised} / {c.funding_goal}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <button disabled={busy === c._id}
                      onClick={() => remove(c._id)} className="btn-danger">
                      <FaTrash /> Delete
                    </button>
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
