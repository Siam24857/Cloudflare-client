import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaBars, FaTimes, FaGithub } from "react-icons/fa";
import NotificationBell from "./NotificationBell.jsx";

const DEV_REPO = import.meta.env.VITE_DEVELOPER_REPO || "#";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:text-brand-700"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Clodfare" className="h-8 w-8" />
          <span className="text-xl font-bold text-brand-700">Clodfare</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {!user && (
            <>
              <NavLink to="/campaigns" className={linkClass}>
                Explore Campaigns
              </NavLink>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary ml-2">
                Register
              </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <div className="ml-2 flex items-center gap-3">
                <span className="badge bg-brand-100 text-brand-700">
                  {user.credits} credits
                </span>
                <NotificationBell />
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL || "/favicon.svg"}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-700">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </div>
            </>
          )}
          <a
            href={DEV_REPO}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost ml-1"
          >
            <FaGithub /> Join as Developer
          </a>
        </div>

        <button
          className="text-2xl text-slate-700 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          {!user && (
            <div className="flex flex-col gap-2">
              <NavLink to="/campaigns" className={linkClass} onClick={() => setOpen(false)}>
                Explore Campaigns
              </NavLink>
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                Register
              </NavLink>
            </div>
          )}
          {user && (
            <div className="flex flex-col gap-2">
              <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <div className="flex items-center justify-between">
                <span className="badge bg-brand-100 text-brand-700">
                  {user.credits} credits
                </span>
                <NotificationBell />
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="btn-outline"
              >
                Logout
              </button>
            </div>
          )}
          <a
            href={DEV_REPO}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost mt-1 w-full"
          >
            <FaGithub /> Join as Developer
          </a>
        </div>
      )}
    </header>
  );
}
