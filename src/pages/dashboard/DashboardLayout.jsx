import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import NotificationBell from "../../components/NotificationBell.jsx";
import Footer from "../../components/Footer.jsx";
import {
  FaHome,
  FaCompass,
  FaHandHoldingUsd,
  FaCoins,
  FaHistory,
  FaPlusCircle,
  FaList,
  FaMoneyBillWave,
  FaUsers,
  FaThLarge,
  FaCheckCircle,
  FaFlag,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navByRole = {
  Supporter: [
    { to: "/dashboard/supporter-home", label: "Home", icon: FaHome },
    { to: "/dashboard/explore-campaigns", label: "Explore Campaigns", icon: FaCompass },
    { to: "/dashboard/my-contributions", label: "My Contributions", icon: FaHandHoldingUsd },
    { to: "/dashboard/purchase-credit", label: "Purchase Credit", icon: FaCoins },
    { to: "/dashboard/payment-history", label: "Payment History", icon: FaHistory },
  ],
  Creator: [
    { to: "/dashboard/creator-home", label: "Home", icon: FaHome },
    { to: "/dashboard/add-campaign", label: "Add New Campaign", icon: FaPlusCircle },
    { to: "/dashboard/my-campaigns", label: "My Campaigns", icon: FaList },
    { to: "/dashboard/withdrawals", label: "Withdrawals", icon: FaMoneyBillWave },
    { to: "/dashboard/payment-history", label: "Payment History", icon: FaHistory },
  ],
  Admin: [
    { to: "/dashboard/admin-home", label: "Home", icon: FaHome },
    { to: "/dashboard/campaign-approvals", label: "Campaign Approvals", icon: FaCheckCircle },
    { to: "/dashboard/withdrawal-requests", label: "Withdrawal Requests", icon: FaMoneyBillWave },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: FaUsers },
    { to: "/dashboard/manage-campaigns", label: "Manage Campaigns", icon: FaThLarge },
    { to: "/dashboard/reports", label: "Reports", icon: FaFlag },
  ],
};

const DEV_REPO = import.meta.env.VITE_DEVELOPER_REPO || "#";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const links = navByRole[user?.role] || [];

  const navLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-brand-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
    }`;

  const sidebar = (
    <aside className="flex w-64 flex-col border-r border-slate-100 bg-white p-4">
      <Link to="/" className="mb-6 flex items-center gap-2 px-2">
        <img src="/favicon.svg" alt="Clodfare" className="h-8 w-8" />
        <span className="text-lg font-bold text-brand-700">Clodfare</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={navLink} onClick={() => setOpen(false)}>
            <l.icon /> {l.label}
          </NavLink>
        ))}
      </nav>
      <a
        href={DEV_REPO}
        target="_blank"
        rel="noreferrer"
        className="mt-4 rounded-lg bg-slate-50 px-4 py-2 text-center text-xs font-semibold text-brand-700 hover:bg-brand-100"
      >
        Join as Developer
      </a>
    </aside>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="text-xl text-slate-700 md:hidden" onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="hidden text-sm font-semibold text-slate-500 hover:text-brand-700 md:block">
            ← Back to site
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge bg-brand-100 text-brand-700">{user?.credits} credits</span>
          <NotificationBell />
          <div className="flex items-center gap-2">
            <img
              src={user?.photoURL || "/favicon.svg"}
              alt={user?.name}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden md:block">{sidebar}</div>
        {/* Mobile drawer */}
        {open && <div className="fixed inset-0 z-40 md:hidden">{sidebar}</div>}

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
