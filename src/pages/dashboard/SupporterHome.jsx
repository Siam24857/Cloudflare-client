import { useEffect, useState } from "react";
import { contributionAPI } from "../../api.js";
import { StatCard, SectionTitle, Spinner, StatusBadge, EmptyState } from "../../components/ui.jsx";

export default function SupporterHome() {
  const [stats, setStats] = useState(null);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    contributionAPI.supporterStats().then((r) => setStats(r.data)).catch(() => setStats({}));
    contributionAPI.supporterApproved().then((r) => setApproved(r.data)).catch(() => setApproved([]));
  }, []);

  if (!stats) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Welcome back 👋" subtitle="Here is a snapshot of your support activity." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total Contributions" value={stats.totalContributions || 0} />
        <StatCard label="Pending Contributions" value={stats.pending || 0} accent />
        <StatCard label="Credits Contributed" value={stats.totalAmount || 0} />
      </div>

      <div className="mt-10">
        <SectionTitle title="Your Approved Contributions" />
        {approved.length === 0 ? (
          <EmptyState message="You have no approved contributions yet." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approved.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3 font-medium text-slate-700">{c.campaign_title}</td>
                    <td className="px-4 py-3 text-slate-500">{c.creator_name}</td>
                    <td className="px-4 py-3 text-brand-700">{c.contribution_amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
