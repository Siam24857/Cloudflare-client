import { useEffect, useState } from "react";
import { userAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState } from "../../components/ui.jsx";
import { FaTrash } from "react-icons/fa";

const ROLES = ["Supporter", "Creator", "Admin"];

export default function ManageUsers() {
  const [users, setUsers] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => userAPI.all().then((r) => setUsers(r.data)).catch(() => setUsers([]));
  useEffect(load, []);

  const changeRole = async (id, role) => {
    setBusy(id);
    try {
      await userAPI.updateRole(id, role);
      load();
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this user permanently?")) return;
    setBusy(id);
    try {
      await userAPI.remove(id);
      load();
    } finally {
      setBusy(null);
    }
  };

  if (users === null) return <Spinner />;

  return (
    <div>
      <SectionTitle title="Manage Users" subtitle={`${users.length} registered users.`} />
      {users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.photoURL || "/favicon.svg"} alt={u.name}
                        className="h-9 w-9 rounded-full border border-slate-200 object-cover" />
                      <span className="font-medium text-slate-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      disabled={busy === u._id}
                      className="input w-36"
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                    >
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-brand-700">{u.credits}</td>
                  <td className="px-4 py-3">
                    <button disabled={busy === u._id}
                      onClick={() => remove(u._id)} className="btn-danger">
                      <FaTrash /> Remove
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
