import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { campaignAPI } from "../api.js";
import { Spinner, SectionTitle, EmptyState, Pagination } from "../components/ui.jsx";
import CampaignCard from "../components/CampaignCard.jsx";

export default function Campaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 12;

  const query = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    setPage(1);
  }, [query, category, sort]);

  useEffect(() => {
    let mounted = true;
    campaignAPI
      .approved(page, limit, query, category, sort)
      .then((r) => {
        if (mounted) setData(r.data);
      })
      .catch(() => {
        if (mounted) setData({ campaigns: [], total: 0, totalPages: 0 });
      });
    return () => { mounted = false; };
  }, [page, query, category, sort]);

  const campaigns = data?.campaigns ?? null;
  const totalPages = data?.totalPages ?? 0;

  const categories = useMemo(() => {
    if (!campaigns) return ["All"];
    return ["All", ...new Set(campaigns.map((c) => c.category))];
  }, [campaigns]);

  const handleSearchChange = (value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) params.set("search", value);
      else params.delete("search");
      params.set("page", "1");
      return params;
    });
  };

  const handleCategoryChange = (cat) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (cat && cat !== "All") params.set("category", cat);
      else params.delete("category");
      params.set("page", "1");
      return params;
    });
  };

  const handleSortChange = (sortValue) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (sortValue && sortValue !== "newest") params.set("sort", sortValue);
      else params.delete("sort");
      params.set("page", "1");
      return params;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage.toString());
      return params;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle
        title="Explore Campaigns"
        subtitle="Discover projects and causes worth supporting."
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          className="input md:max-w-xs"
          placeholder="Search by title or creator…"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => handleCategoryChange(c)}
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
        <select
          className="input w-auto"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-funded">Most Funded</option>
          <option value="least-funded">Least Funded</option>
          <option value="ending-soon">Ending Soon</option>
        </select>
      </div>

      {campaigns === null ? (
        <Spinner />
      ) : campaigns.length === 0 ? (
        <EmptyState message="No campaigns match your search." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} link={`/dashboard/campaign/${c._id}`} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
