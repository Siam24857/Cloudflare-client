import { useEffect, useState } from "react";
import { paymentAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, StatusBadge } from "../../components/ui.jsx";

export default function SupporterPaymentHistory() {
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    paymentAPI
      .supporterAll()
      .then((r) => setPayments(r.data))
      .catch(() => setPayments([]));
  }, []);

  return (
    <div>
      <SectionTitle title="Payment History" subtitle="Your credit purchases." />
      {payments === null ? (
        <Spinner />
      ) : payments.length === 0 ? (
        <EmptyState message="No payments yet." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Credits Added</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 text-slate-500">{p.date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">${p.amount_paid}</td>
                  <td className="px-4 py-3 text-brand-700">+{p.credits_added}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.transaction_id}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
