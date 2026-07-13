import { useEffect, useState } from "react";
import { contributionAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, StatusBadge } from "../../components/ui.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LIMIT = 5;

export default function MyContributions() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    contributionAPI
      .supporterAll(page, LIMIT)
      .then((r) => setData(r.data))
      .catch(() => setData({ contributions: [], total: 0, totalPages: 1 }));
  }, [page]);

  if (!data) return <Spinner />;

  return (
    <div>
      <SectionTitle
        title="My Contributions"
        subtitle={`You have made ${data.total} contributions.`}
      />

      {data.contributions.length === 0 ? (
        <EmptyState message="You haven't made any contributions yet." />
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.contributions.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3 font-medium text-slate-700">{c.campaign_title}</td>
                    <td className="px-4 py-3 text-brand-700">{c.contribution_amount}</td>
                    <td className="px-4 py-3 text-slate-500">{c.creator_name}</td>
                    <td className="px-4 py-3 text-slate-500">{c.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn-outline"
            >
              <FaChevronLeft /> Prev
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
