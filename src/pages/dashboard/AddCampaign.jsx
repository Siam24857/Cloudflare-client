import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { campaignAPI, uploadAPI } from "../../api.js";
import { Spinner } from "../../components/ui.jsx";
import { FaImage } from "react-icons/fa";

const CATEGORIES = ["Technology", "Art", "Community", "Health"];

export default function AddCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    imageBase64: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(",")[1]);
        r.readAsDataURL(file);
      });
      const res = await uploadAPI.image(base64);
      set("imageUrl", res.data.url);
      set("imageBase64", base64);
    } catch (err) {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.campaign_title || !form.campaign_story || !form.reward_info) {
      return setError("Please fill in all text fields.");
    }
    setBusy(true);
    try {
      await campaignAPI.create({
        campaign_title: form.campaign_title,
        campaign_story: form.campaign_story,
        category: form.category,
        funding_goal: Number(form.funding_goal),
        minimum_contribution: Number(form.minimum_contribution),
        deadline: form.deadline,
        reward_info: form.reward_info,
        imageBase64: form.imageBase64,
        campaign_image_url: form.imageUrl,
      });
      navigate("/dashboard/my-campaigns");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Add New Campaign</h1>
      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>
      )}
      <form onSubmit={submit} className="card space-y-4 p-6">
        <div>
          <label className="label">Campaign Title</label>
          <input className="input" value={form.campaign_title}
            onChange={(e) => set("campaign_title", e.target.value)}
            placeholder="Help us build a solar-powered water pump" />
        </div>
        <div>
          <label className="label">Campaign Story</label>
          <textarea className="input h-32" value={form.campaign_story}
            onChange={(e) => set("campaign_story", e.target.value)}
            placeholder="Describe your project in detail…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category}
              onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input type="date" className="input" value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)} />
          </div>
          <div>
            <label className="label">Funding Goal (credits)</label>
            <input type="number" className="input" value={form.funding_goal}
              onChange={(e) => set("funding_goal", e.target.value)} min="1" />
          </div>
          <div>
            <label className="label">Minimum Contribution</label>
            <input type="number" className="input" value={form.minimum_contribution}
              onChange={(e) => set("minimum_contribution", e.target.value)} min="1" />
          </div>
        </div>
        <div>
          <label className="label">Reward Info</label>
          <input className="input" value={form.reward_info}
            onChange={(e) => set("reward_info", e.target.value)}
            placeholder="What supporters receive for pledging" />
        </div>
        <div>
          <label className="label">Cover Image</label>
          <div className="flex items-center gap-3">
            <img src={form.imageUrl || "/favicon.svg"} alt="cover"
              className="h-16 w-24 rounded-lg border border-slate-200 object-cover" />
            <label className="btn-outline cursor-pointer">
              <FaImage /> {uploading ? "Uploading…" : "Upload (imgBB)"}
              <input type="file" accept="image/*" hidden onChange={handleImage} />
            </label>
          </div>
          <input className="input mt-2" value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="…or paste an image URL" />
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? <Spinner label="Publishing…" /> : "Add Campaign"}
        </button>
      </form>
    </div>
  );
}
