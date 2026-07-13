import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { campaignAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState } from "../../components/ui.jsx";
import CampaignCard from "../../components/CampaignCard.jsx";

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    campaignAPI
      .approved()
      .then((r) => setCampaigns(r.data))
      .catch(() => setCampaigns([]));
  }, []);

  const categories = campaigns
    ? ["All", ...new Set(campaigns.map((c) => c.category))]
    : ["All"];

  const filtered = campaigns
    ? campaigns.filter((c) => {
        const q =
          c.campaign_title.toLowerCase().includes(query.toLowerCase()) ||
          c.creator_name.toLowerCase().includes(query.toLowerCase());
        return q && (category === "All" || c.category === category);
      })
    : [];

  return (
    <div>
      <SectionTitle
        title="Explore Campaigns"
        subtitle="Browse live campaigns and pledge your credits."
      />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          className="input md:max-w-xs"
          placeholder="Search by title or creator…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`badge ${
                category === c ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {campaigns === null ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState message="No campaigns match your search." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CampaignCard key={c._id} campaign={c} link={`/dashboard/campaign/${c._id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
