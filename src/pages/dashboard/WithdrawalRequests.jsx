import { useEffect, useState } from "react";
import { withdrawalAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, StatusBadge } from "../../components/ui.jsx";
import { FaCheckCircle } from "react-icons/fa";

export default function WithdrawalRequests() {
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    let mounted = true;
    withdrawalAPI.adminPending().then((r) => { if (mounted) setList(r.data); }).catch(() => { if (mounted) setList([]); });
    return () => { mounted = false; };
  };
  useEffect(load, []);

  const approve = async (id) => {
    setBusy(id);
    try {
      await withdrawalAPI.approve(id);
      load();
    } finally {
      setBusy(null);
    }
  };

  if (list === null) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Withdrawal Requests" subtitle="Mark payouts as completed." />
      {list.length === 0 ? (
        <EmptyState message="No pending withdrawal requests." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((w) => (
                <tr key={w._id}>
                  <td className="px-4 py-3 font-medium text-slate-700">{w.creator_name}</td>
                  <td className="px-4 py-3 text-brand-700">{w.withdrawal_credit}</td>
                  <td className="px-4 py-3 text-slate-700">${w.withdrawal_amount}</td>
                  <td className="px-4 py-3 text-slate-500">{w.payment_system}</td>
                  <td className="px-4 py-3 text-slate-500">{w.account_number}</td>
                  <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                  <td className="px-4 py-3">
                    <button disabled={busy === w._id}
                      onClick={() => approve(w._id)} className="btn-primary">
                      <FaCheckCircle /> Payment Success
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
