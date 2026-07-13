import { useEffect, useState } from "react";
import { campaignAPI, contributionAPI } from "../../api.js";
import { StatCard, SectionTitle, Spinner, Modal, EmptyState } from "../../components/ui.jsx";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function CreatorHome() {
  const [campaigns, setCampaigns] = useState(null);
  const [pending, setPending] = useState([]);
  const [view, setView] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    campaignAPI.myCampaigns().then((r) => setCampaigns(r.data)).catch(() => setCampaigns([]));
    contributionAPI.creatorPending().then((r) => setPending(r.data)).catch(() => setPending([]));
  };

  useEffect(load, []);

  if (campaigns === null) return <Spinner />;

  const active = campaigns.filter(
    (c) => new Date(c.deadline) >= new Date().setHours(0, 0, 0, 0)
  ).length;
  const raised = campaigns.reduce((s, c) => s + (c.amount_raised || 0), 0);

  const act = async (id, fn) => {
    setBusy(id);
    try {
      await fn(id);
      load();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <SectionTitle title="Creator Dashboard" subtitle="Track your campaigns and contributions." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total Campaigns" value={campaigns.length} />
        <StatCard label="Active Campaigns" value={active} accent />
        <StatCard label="Credits Raised" value={raised} />
      </div>

      <div className="mt-10">
        <SectionTitle title="Contributions To Review" subtitle="Approve or reject pending pledges." />
        {pending.length === 0 ? (
          <EmptyState message="No pending contributions right now." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Supporter</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pending.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3 font-medium text-slate-700">{c.supporter_name}</td>
                    <td className="px-4 py-3 text-slate-500">{c.campaign_title}</td>
                    <td className="px-4 py-3 text-brand-700">{c.contribution_amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setView(c)} className="btn-outline">
                          View
                        </button>
                        <button
                          disabled={busy === c._id}
                          onClick={() => act(c._id, contributionAPI.approve)}
                          className="btn-primary"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          disabled={busy === c._id}
                          onClick={() => act(c._id, contributionAPI.reject)}
                          className="btn-danger"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title="Contribution Detail">
        {view && (
          <div className="space-y-3 text-sm">
            <p><b>Supporter:</b> {view.supporter_name}</p>
            <p><b>Campaign:</b> {view.campaign_title}</p>
            <p><b>Amount:</b> <span className="text-brand-700">{view.contribution_amount} credits</span></p>
            <p><b>Date:</b> {view.date}</p>
            <div>
              <b>Message:</b>
              <p className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-600">
                {view.message || "No message provided."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
