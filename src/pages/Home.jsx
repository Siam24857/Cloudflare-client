import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { campaignAPI } from "../api.js";
import { Spinner, SectionTitle } from "../components/ui.jsx";
import CampaignCard from "../components/CampaignCard.jsx";
import { FaRocket, FaHandHoldingHeart, FaShieldAlt, FaChartLine } from "react-icons/fa";

const heroSlides = [
  {
    title: "Fund the ideas that matter",
    subtitle:
      "Clodfare helps creators raise platform credits from a global community of supporters.",
    cta: "Explore Campaigns",
    to: "/campaigns",
    bg: "from-brand-600 to-accent-500",
  },
  {
    title: "Launch your dream project",
    subtitle:
      "Creators get the tools to publish, promote, and withdraw funds once approved.",
    cta: "Become a Creator",
    to: "/register",
    bg: "from-accent-600 to-brand-700",
  },
  {
    title: "Support causes you believe in",
    subtitle:
      "Every credit you give moves a campaign closer to its goal. Track it all in your dashboard.",
    cta: "Get Started",
    to: "/register",
    bg: "from-brand-700 to-brand-500",
  },
];

const testimonials = [
  {
    name: "Amara N.",
    role: "Creator",
    photo: "https://i.pravatar.cc/100?img=47",
    quote:
      "Clodfare helped me fund a community solar project in just three weeks. The dashboard is incredibly clear.",
  },
  {
    name: "Daniel K.",
    role: "Supporter",
    photo: "https://i.pravatar.cc/100?img=12",
    quote:
      "I love seeing exactly where my credits go. The notifications keep me in the loop on every campaign.",
  },
  {
    name: "Priya S.",
    role: "Creator",
    photo: "https://i.pravatar.cc/100?img=32",
    quote:
      "Approval was fast and withdrawals were smooth. This is the fairest crowdfunding platform I have used.",
  },
];

const steps = [
  {
    icon: FaRocket,
    title: "Create a campaign",
    text: "Tell your story, set a funding goal, and publish for admin approval.",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Gather support",
    text: "Supporters pledge credits to the campaigns they believe in.",
  },
  {
    icon: FaShieldAlt,
    title: "Get approved & paid",
    text: "Admins review campaigns, then creators withdraw earned credits.",
  },
];

const categories = [
  { name: "Technology", color: "bg-brand-100 text-brand-700" },
  { name: "Art", color: "bg-accent-100 text-accent-600" },
  { name: "Community", color: "bg-emerald-100 text-emerald-700" },
  { name: "Health", color: "bg-rose-100 text-rose-700" },
];

export default function Home() {
  const [top, setTop] = useState(null);

  useEffect(() => {
    campaignAPI
      .topFunded()
      .then((r) => setTop(r.data))
      .catch(() => setTop([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500 }}
        loop
        className="h-[420px] w-full md:h-[480px]"
      >
        {heroSlides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className={`flex h-full w-full items-center bg-gradient-to-r ${s.bg}`}
            >
              <div className="mx-auto w-full max-w-7xl px-6 text-white">
                <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl animate-fadeIn">
                  {s.title}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-white/90">{s.subtitle}</p>
                <Link to={s.to} className="btn-accent mt-6">
                  {s.cta}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Top funded */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle
          title="Top Funded Campaigns"
          subtitle="The campaigns raising the most credits right now."
        />
        {top === null ? (
          <Spinner />
        ) : top.length === 0 ? (
          <p className="text-slate-400">No campaigns live yet — be the first!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((c) => (
              <CampaignCard key={c._id} campaign={c} link={`/dashboard/campaign/${c._id}`} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link to="/campaigns" className="btn-outline">
            Browse all campaigns
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle title="How It Works" subtitle="Three simple steps to make an impact." />
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-700">
                  <s.icon />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by category */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle title="Explore by Category" subtitle="Find campaigns in the areas you care about." />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              to="/campaigns"
              key={c.name}
              className={`flex h-28 items-center justify-center rounded-2xl text-lg font-semibold ${c.color} transition hover:scale-105`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle title="What Our Community Says" />
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            spaceBetween={20}
            breakpoints={{ 768: { slidesPerView: 2 } }}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="card m-1 h-full p-6">
                  <p className="text-slate-600">“{t.quote}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle title="Platform Impact in Numbers" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { n: "20+", l: "Active campaigns" },
            { n: "5,000+", l: "Credits pledged" },
            { n: "1,200+", l: "Registered supporters" },
            { n: "98%", l: "Approval satisfaction" },
          ].map((s, i) => (
            <div key={i} className="card flex flex-col items-center p-6 text-center">
              <FaChartLine className="mb-2 text-2xl text-accent-500" />
              <p className="text-3xl font-bold text-brand-700">{s.n}</p>
              <p className="mt-1 text-sm text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-700 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to make an impact?</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/80">
          Join thousands of creators and supporters building a better tomorrow.
        </p>
        <Link to="/register" className="btn-accent mt-6">
          Create your free account
        </Link>
      </section>
    </div>
  );
}
