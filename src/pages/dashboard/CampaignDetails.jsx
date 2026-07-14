import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { campaignAPI, contributionAPI, reportAPI } from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Spinner, SectionTitle, Modal, EmptyState } from "../../components/ui.jsx";
import { FaUser, FaBullseye, FaRegCalendarCheck, FaFlag, FaGift } from "react-icons/fa";

export default function CampaignDetails() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reportDone, setReportDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    campaignAPI
      .getOne(id)
      .then((r) => {
        if (mounted) setCampaign(r.data);
      })
      .catch(() => {
        if (mounted) setCampaign(false);
      });
    return () => { mounted = false; };
  }, [id]);

  if (campaign === null) return <Spinner />;
  if (campaign === false)
    return <EmptyState message="Campaign not found." />;

  const pct = Math.min(
    100,
    Math.round((campaign.amount_raised / campaign.funding_goal) * 100)
  );

  const submit = async (e) => {
    e.preventDefault();
    setMsg({});
    const value = Number(amount);
    if (!value || value < campaign.minimum_contribution) {
      return setMsg({
        type: "error",
        text: `Minimum contribution is ${campaign.minimum_contribution} credits.`,
      });
    }
    if (user.credits < value) {
      return setMsg({ type: "error", text: "You don't have enough credits." });
    }
    setBusy(true);
    try {
      await contributionAPI.create({
        campaign_id: campaign._id,
        contribution_amount: value,
        message: "",
      });
      setUser({ credits: user.credits - value });
      setMsg({ type: "success", text: "Contribution submitted! Awaiting creator approval." });
      setAmount("");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed" });
    } finally {
      setBusy(false);
    }
  };

  const sendReport = async () => {
    if (!reason.trim()) return;
    try {
      await reportAPI.create({ campaign_id: campaign._id, reason });
      setReportDone(true);
      setReportOpen(false);
    } catch (err) {
      setMsg({ type: "error", text: "Report failed" });
    }
  };

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <img
            src={campaign.campaign_image_url || "/favicon.svg"}
            alt={campaign.campaign_title}
            className="h-64 w-full rounded-2xl object-cover"
          />
          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            {campaign.campaign_title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <FaUser /> {campaign.creator_name}
            </span>
            <span className="flex items-center gap-2">
              <FaRegCalendarCheck /> Deadline: {campaign.deadline}
            </span>
            <span className="badge bg-brand-100 text-brand-700">{campaign.category}</span>
          </div>

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-brand-700">
                {campaign.amount_raised} / {campaign.funding_goal} credits
              </span>
              <span className="text-slate-400">{pct}% funded</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="card mt-6 p-6">
            <h3 className="font-semibold text-slate-800">About this campaign</h3>
            <p className="mt-2 whitespace-pre-line text-slate-600">{campaign.campaign_story}</p>
          </div>

          <div className="card mt-4 p-6">
            <h3 className="flex items-center gap-2 font-semibold text-slate-800">
              <FaGift /> Reward for supporters
            </h3>
            <p className="mt-2 text-slate-600">{campaign.reward_info}</p>
          </div>
        </div>

        <div>
          <div className="card sticky top-20 p-6">
            <h3 className="font-semibold text-slate-800">Support this campaign</h3>
            <p className="mt-1 text-sm text-slate-500">
              Minimum: {campaign.minimum_contribution} credits · You have{" "}
              <b className="text-brand-700">{user.credits}</b> credits
            </p>

            {msg.text && (
              <p
                className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                  msg.type === "error"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {msg.text}
              </p>
            )}

            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                type="number"
                className="input"
                placeholder={`Credits to contribute`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={campaign.minimum_contribution}
              />
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? "Submitting…" : "Contribute"}
              </button>
            </form>

            <button
              onClick={() => setReportOpen(true)}
              className="btn-outline mt-3 w-full text-rose-600"
            >
              <FaFlag /> Report Campaign
            </button>
          </div>
        </div>
      </div>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report this campaign">
        {reportDone ? (
          <p className="text-emerald-600">Thanks! Our admin team will review this report.</p>
        ) : (
          <>
            <p className="text-sm text-slate-500">
              Tell us why this campaign looks suspicious or fraudulent.
            </p>
            <textarea
              className="input mt-3 h-32"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the issue…"
            />
            <button onClick={sendReport} className="btn-danger mt-3 w-full">
              Submit Report
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
