import { Link } from "react-router-dom";
import { FaUser, FaBullseye, FaChartLine } from "react-icons/fa";

export default function CampaignCard({ campaign, link = "/dashboard/explore-campaigns" }) {
  const pct = campaign.funding_goal
    ? Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100))
    : 0;
  return (
    <Link
      to={link}
      className="card group block overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-brand-50">
        <img
          src={campaign.campaign_image_url || "/favicon.svg"}
          alt={campaign.campaign_title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="badge absolute left-3 top-3 bg-white/90 text-brand-700">
          {campaign.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-800">
          {campaign.campaign_title}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <FaUser /> {campaign.creator_name}
        </p>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FaChartLine /> {campaign.amount_raised} raised
            </span>
            <span className="flex items-center gap-1">
              <FaBullseye /> {campaign.funding_goal} goal
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
