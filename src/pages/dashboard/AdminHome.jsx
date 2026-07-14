import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../../api.js";
import { StatCard, SectionTitle, Spinner } from "../../components/ui.jsx";
import { FaUsers, FaUserTie, FaCoins, FaCreditCard } from "react-icons/fa";

export default function AdminHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    userAPI
      .adminStats()
      .then((r) => { if (mounted) setStats(r.data); })
      .catch(() => { if (mounted) setStats({}); });
    return () => { mounted = false; };
  }, []);

  if (!stats) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Admin Overview" subtitle="Platform health at a glance." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Supporters" value={stats.supporters || 0} />
        <StatCard label="Total Creators" value={stats.creators || 0} accent />
        <StatCard label="Credits in Circulation" value={stats.totalCredits || 0} />
        <StatCard label="Payments Processed" value={stats.paymentsProcessed || 0} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link to="/dashboard/campaign-approvals" className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <FaUsers className="text-2xl text-brand-600" />
          <h3 className="mt-3 font-semibold text-slate-800">Campaign Approvals</h3>
          <p className="mt-1 text-sm text-slate-500">Review newly submitted campaigns.</p>
        </Link>
        <Link to="/dashboard/withdrawal-requests" className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <FaCreditCard className="text-2xl text-accent-600" />
          <h3 className="mt-3 font-semibold text-slate-800">Withdrawal Requests</h3>
          <p className="mt-1 text-sm text-slate-500">Process creator payouts.</p>
        </Link>
        <Link to="/dashboard/reports" className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <FaUserTie className="text-2xl text-rose-500" />
          <h3 className="mt-3 font-semibold text-slate-800">Reports</h3>
          <p className="mt-1 text-sm text-slate-500">Handle flagged campaigns.</p>
        </Link>
      </div>
    </div>
  );
}
