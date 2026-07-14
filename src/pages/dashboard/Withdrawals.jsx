import { useEffect, useState } from "react";
import { withdrawalAPI } from "../../api.js";
import { Spinner, SectionTitle, StatCard, EmptyState, StatusBadge } from "../../components/ui.jsx";

const SYSTEMS = ["Stripe", "Bkash", "Rocket", "Nagad"];

export default function Withdrawals() {
  const [stats, setStats] = useState(null);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    credits: "",
    system: "Stripe",
    account: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    let mounted = true;
    withdrawalAPI.creatorStats().then((r) => { if (mounted) setStats(r.data); }).catch(() => { if (mounted) setStats({ raisedCredits: 0, withdrawalDollars: 0, canWithdraw: false }); });
    withdrawalAPI.creatorAll().then((r) => { if (mounted) setList(r.data); }).catch(() => { if (mounted) setList([]); });
    return () => { mounted = false; };
  };
  useEffect(load, []);

  if (!stats) return <Spinner />;

  const dollars = form.credits ? (Number(form.credits) / 20).toFixed(2) : "0.00";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.credits || Number(form.credits) <= 0)
      return setError("Enter credits to withdraw.");
    if (!form.account) return setError("Enter your account number.");
    setBusy(true);
    try {
      await withdrawalAPI.create({
        withdrawal_credit: Number(form.credits),
        withdrawal_amount: Number((Number(form.credits) / 20).toFixed(2)),
        payment_system: form.system,
        account_number: form.account,
      });
      setForm({ credits: "", system: "Stripe", account: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <SectionTitle title="Withdrawals" subtitle="Redeem your raised credits (20 credits = $1)." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard label="Total Credits Raised" value={stats.raisedCredits} />
        <StatCard label="Withdrawal Value" value={`$${stats.withdrawalDollars.toFixed(2)}`} accent />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800">Request a Withdrawal</h3>
          {!stats.canWithdraw && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              You need at least 200 raised credits (=$10) to withdraw.
            </p>
          )}
          {error && (
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
          )}
          {stats.canWithdraw ? (
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label className="label">Credits To Withdraw (max {stats.raisedCredits})</label>
                <input type="number" className="input" value={form.credits}
                  max={stats.raisedCredits} min="1"
                  onChange={(e) => setForm({ ...form, credits: e.target.value })} />
              </div>
              <div>
                <label className="label">Withdraw Amount ($)</label>
                <input className="input bg-slate-50" value={`$${dollars}`} readOnly />
              </div>
              <div>
                <label className="label">Payment System</label>
                <select className="input" value={form.system}
                  onChange={(e) => setForm({ ...form, system: e.target.value })}>
                  {SYSTEMS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Account Number</label>
                <input className="input" value={form.account}
                  onChange={(e) => setForm({ ...form, account: e.target.value })}
                  placeholder="e.g. 01XXXXXXXXX" />
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? "Submitting…" : "Withdraw"}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm font-semibold text-rose-500">Insufficient credit</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-slate-800">Payment History</h3>
          {list.length === 0 ? (
            <EmptyState message="No withdrawals yet." />
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Credits</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">System</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((w) => (
                    <tr key={w._id}>
                      <td className="px-4 py-3 text-brand-700">{w.withdrawal_credit}</td>
                      <td className="px-4 py-3 text-slate-700">${w.withdrawal_amount}</td>
                      <td className="px-4 py-3 text-slate-500">{w.payment_system}</td>
                      <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
