import { useEffect, useMemo, useState } from "react";
import { campaignAPI } from "../api.js";
import { Spinner, SectionTitle, EmptyState, Pagination } from "../components/ui.jsx";
import CampaignCard from "../components/CampaignCard.jsx";

export default function Campaigns() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const limit = 12;

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  useEffect(() => {
    campaignAPI
      .approved(page, limit)
      .then((r) => setData(r.data))
      .catch(() => setData({ campaigns: [], total: 0, totalPages: 0 }));
  }, [page]);

  const campaigns = data?.campaigns ?? null;
  const totalPages = data?.totalPages ?? 0;

  const categories = useMemo(() => {
    if (!campaigns) return ["All"];
    return ["All", ...new Set(campaigns.map((c) => c.category))];
  }, [campaigns]);

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((c) => {
      const matchesQuery =
        c.campaign_title.toLowerCase().includes(query.toLowerCase()) ||
        c.creator_name.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === "All" || c.category === category;
      return matchesQuery && matchesCat;
    });
  }, [campaigns, query, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle
        title="Explore Campaigns"
        subtitle="Discover projects and causes worth supporting."
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
                category === c
                  ? "bg-brand-600 text-white"
                  : "bg-brand-50 text-brand-700 hover:bg-brand-100"
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
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CampaignCard key={c._id} campaign={c} link={`/dashboard/campaign/${c._id}`} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
