import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { campaignAPI } from "../../api.js";
import { Spinner, SectionTitle, EmptyState, Pagination } from "../../components/ui.jsx";
import CampaignCard from "../../components/CampaignCard.jsx";

export default function ExploreCampaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState(["All"]);
  const limit = 12;

  const page = parseInt(searchParams.get("page")) || 1;
  const query = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";

  const handleSearchChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value);
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params, { replace: true });
  };

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

  useEffect(() => {
    if (campaigns) {
      const cats = ["All", ...new Set(campaigns.map((c) => c.category))];
      setCategories(cats);
    }
  }, [campaigns]);

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