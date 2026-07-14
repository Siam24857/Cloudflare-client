import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { notificationAPI } from "../api.js";
import { FaBell, FaTimes } from "react-icons/fa";

export default function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!user) return;
    try {
      const res = await notificationAPI.all();
      setItems(res.data);
    } catch (e) {
      /* ignore */
    }
  };

  useEffect(() => {
    let mounted = true;
    const doLoad = async () => {
      if (!user) return;
      try {
        const res = await notificationAPI.all();
        if (mounted) setItems(res.data);
      } catch (e) {
        /* ignore */
      }
    };
    doLoad();
    return () => { mounted = false; };
  }, [user]);

  const unread = items.filter((n) => !n.read).length;

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) load();
  };

  const handleClick = async (n) => {
    if (!n.read) {
      try {
        await notificationAPI.markRead(n._id);
      } catch (e) {}
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative rounded-full p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
        aria-label="Notifications"
      >
        <FaBell />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 max-h-96 w-80 animate-fadeIn overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h4 className="font-semibold text-slate-700">Notifications</h4>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>
            {items.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                No notifications yet.
              </p>
            )}
            {items.map((n) => (
              <Link
                key={n._id}
                to={n.actionRoute || "/dashboard"}
                onClick={() => handleClick(n)}
                className={`block border-b border-slate-50 px-4 py-3 text-sm transition hover:bg-brand-50 ${
                  n.read ? "text-slate-500" : "text-slate-800"
                }`}
              >
                <p>{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(n.time).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
