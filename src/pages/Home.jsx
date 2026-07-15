import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { campaignAPI } from "../api.js";
import { Spinner, SectionTitle } from "../components/ui.jsx";
import CampaignCard from "../components/CampaignCard.jsx";
import { FaRocket, FaHandHoldingHeart, FaShieldAlt, FaChartLine, FaArrowRight } from "react-icons/fa";

const heroImages = [
  "https://media.brightdata.com/2024/09/How-to-Bypass-Cloudflare.svg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM3UhaA0tiXQ0RVhG8TnOOkcW6IFU3wZoks1v2FgCUZA&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3z_tqWyHvajTaFY7gzCZqSdTkWEKOqFYd863TSD0xcw&s=10",
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
  { name: "Technology", color: "bg-blue-100 text-blue-700" },
  { name: "Art", color: "bg-cyan-100 text-cyan-600" },
  { name: "Community", color: "bg-emerald-100 text-emerald-700" },
  { name: "Health", color: "bg-rose-100 text-rose-700" },
];

export default function Home() {
  const [top, setTop] = useState(null);

  useEffect(() => {
    let mounted = true;
    campaignAPI
      .topFunded()
      .then((r) => {
        if (mounted) setTop(r.data);
      })
      .catch(() => {
        if (mounted) setTop([]);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* ───── Professional Hero Banner ───── */}
      <section className="relative min-h-[90vh] overflow-hidden bg-slate-900">
        {/* Background image grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
          <div className="relative col-span-2 row-span-2 overflow-hidden">
            <img
              src={heroImages[0]}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-700/60 to-transparent" />
          </div>
          <div className="relative overflow-hidden">
            <img
              src={heroImages[1]}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-brand-800/70 to-brand-600/40" />
          </div>
          <div className="relative overflow-hidden">
            <img
              src={heroImages[2]}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-700/50 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
          <div className="animate-fadeIn rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-md md:p-12 lg:p-16">
            <span className="mb-4 inline-block rounded-full bg-brand-500/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              Next-Gen Crowdfunding Platform
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Fund the ideas<br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                that matter
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80 md:text-xl">
              Clodfare helps creators raise platform credits from a global
              community of supporters. Launch, grow, and make an impact.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/campaigns"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-blue-50"
              >
                Explore Campaigns
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid w-full max-w-3xl grid-cols-3 gap-4 text-white">
            {[
              { n: "20+", l: "Active campaigns" },
              { n: "5,000+", l: "Credits pledged" },
              { n: "1,200+", l: "Supporters" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white md:text-3xl">{s.n}</p>
                <p className="mt-1 text-xs text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </section>

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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700">
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
              to={`/campaigns?category=${encodeURIComponent(c.name)}`}
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
                  <p className="text-slate-600">"{t.quote}"</p>
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
              <FaChartLine className="mb-2 text-2xl text-cyan-500" />
              <p className="text-3xl font-bold text-blue-700">{s.n}</p>
              <p className="mt-1 text-sm text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-700 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to make an impact?</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/80">
          Join thousands of creators and supporters building a better tomorrow.
        </p>
        <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
          Create your free account
        </Link>
      </section>
    </div>
  );
}
