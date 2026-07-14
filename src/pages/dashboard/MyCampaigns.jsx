import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { campaignAPI } from "../../api.js";
import { Spinner, SectionTitle, Modal, EmptyState, StatusBadge } from "../../components/ui.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState(null);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    let mounted = true;
    campaignAPI.myCampaigns().then((r) => { if (mounted) setCampaigns(r.data); }).catch(() => { if (mounted) setCampaigns([]); });
    return () => { mounted = false; };
  };
  useEffect(load, []);

  const saveEdit = async () => {
    setBusy(true);
    try {
      await campaignAPI.update(edit._id, {
        campaign_title: edit.campaign_title,
        campaign_story: edit.campaign_story,
        reward_info: edit.reward_info,
      });
      setEdit(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      await campaignAPI.remove(confirm._id);
      setConfirm(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  if (campaigns === null) return <Spinner />;

  return (
    <div>
      <SectionTitle title="My Campaigns" subtitle="Manage the campaigns you launched." />
      {campaigns.length === 0 ? (
        <EmptyState message="You haven't created any campaigns yet." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Raised / Goal</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-slate-700">{c.campaign_title}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {c.amount_raised} / {c.funding_goal}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.deadline}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setEdit(c)} className="btn-outline">
                        <FaEdit /> Update
                      </button>
                      <button onClick={() => setConfirm(c)} className="btn-danger">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Update Campaign">
        {edit && (
          <div className="space-y-3">
            <div>
              <label className="label">Title</label>
              <input className="input" value={edit.campaign_title}
                onChange={(e) => setEdit({ ...edit, campaign_title: e.target.value })} />
            </div>
            <div>
              <label className="label">Story</label>
              <textarea className="input h-28" value={edit.campaign_story}
                onChange={(e) => setEdit({ ...edit, campaign_story: e.target.value })} />
            </div>
            <div>
              <label className="label">Reward Info</label>
              <input className="input" value={edit.reward_info}
                onChange={(e) => setEdit({ ...edit, reward_info: e.target.value })} />
            </div>
            <button disabled={busy} onClick={saveEdit} className="btn-primary w-full">
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Campaign">
        <p className="text-slate-600">
          Delete <b>{confirm?.campaign_title}</b>? All approved supporters will be
          refunded their contributions.
        </p>
        <div className="mt-4 flex gap-3">
          <button disabled={busy} onClick={doDelete} className="btn-danger flex-1">
            {busy ? "Deleting…" : "Yes, Delete"}
          </button>
          <button onClick={() => setConfirm(null)} className="btn-outline">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
