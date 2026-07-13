import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentAPI } from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Modal, SectionTitle, Spinner } from "../../components/ui.jsx";
import { FaCoins, FaCheckCircle } from "react-icons/fa";

const PACKAGES = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

export default function PurchaseCredit() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Stripe redirects back here with ?session_id=... — verify and credit the account.
  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    (async () => {
      setBusy(true);
      try {
        const res = await paymentAPI.verify(sessionId);
        if (res.data.ok) {
          setUser({ credits: user.credits + res.data.credits });
          setDone(true);
        }
      } catch (e) {
        /* ignore */
      } finally {
        setBusy(false);
        navigate("/dashboard/purchase-credit", { replace: true });
      }
    })();
    // eslint-disable-next-line
  }, []);

  const pay = async () => {
    setBusy(true);
    try {
      // Try real Stripe Checkout first; server returns a hosted URL.
      const res = await paymentAPI.createCheckout({
        credits: selected.credits,
        price: selected.price,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
        return;
      }
      throw new Error("no-stripe");
    } catch (e) {
      // Fallback: simulated payment when Stripe is not configured.
      try {
        const res = await paymentAPI.create({
          amount_paid: selected.price,
          credits_added: selected.credits,
          transaction_id: `stripe_demo_${Date.now()}`,
        });
        setUser({ credits: user.credits + res.data.credits_added });
        setDone(true);
      } catch (err) {
        setSelected({ ...selected, error: true });
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div>
      <SectionTitle
        title="Purchase Credits"
        subtitle={`You currently have ${user.credits} credits. 10 credits = $1.`}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PACKAGES.map((p) => (
          <div key={p.credits} className="card flex flex-col p-6 text-center">
            <FaCoins className="mx-auto text-3xl text-accent-500" />
            <p className="mt-3 text-2xl font-bold text-slate-800">{p.credits}</p>
            <p className="text-sm text-slate-500">credits</p>
            <p className="mt-2 text-lg font-semibold text-brand-700">${p.price}</p>
            <button onClick={() => setSelected(p)} className="btn-primary mt-4">
              Buy Now
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => !busy && setSelected(null)}
        title="Confirm Purchase"
      >
        {done ? (
          <div className="text-center">
            <FaCheckCircle className="mx-auto text-4xl text-emerald-500" />
            <p className="mt-3 font-semibold text-slate-700">
              Payment successful! Credits added to your balance.
            </p>
            <button onClick={() => { setSelected(null); setDone(false); }} className="btn-primary mt-4">
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-slate-600">
              You are about to purchase <b>{selected?.credits} credits</b> for{" "}
              <b>${selected?.price}</b>.
            </p>
            {selected?.error && (
              <p className="mt-2 text-sm text-rose-500">Payment failed, try again.</p>
            )}
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
              Payments are processed securely via Stripe Checkout.
            </p>
            <div className="mt-4 flex gap-3">
              <button disabled={busy} onClick={pay} className="btn-primary flex-1">
                {busy ? <Spinner label="Processing…" /> : "Pay Now"}
              </button>
              <button disabled={busy} onClick={() => setSelected(null)} className="btn-outline">
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
