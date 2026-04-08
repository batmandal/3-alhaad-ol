"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store/app-store";

export default function DashboardSection() {
  const { posts, claims } = useAppStore();

  const stats = useMemo(() => {
    const publishedPosts = posts.filter((post) => post.status === "published");

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyPosts = publishedPosts.filter((post) => {
      const d = new Date(post.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const approvedClaims = claims.filter((claim) => claim.status === "approved");

    const uniqueRecoveredUsers = new Set(
      approvedClaims.map((claim) => claim.claimantId)
    ).size;

    return {
      totalPublished: publishedPosts.length,
      monthlyPosts: monthlyPosts.length,
      recoveredUsers: uniqueRecoveredUsers,
    };
  }, [posts, claims]);

  const cards = [
    {
      title: "Нийт идэвхтэй зар",
      value: stats.totalPublished,
      desc: "Нийтлэгдсэн зарууд",
      text: "text-blue-600",
      bg: "from-blue-500/15 to-blue-100/40",
    },
    {
      title: "Энэ сарын зар",
      value: stats.monthlyPosts,
      desc: "Сүүлийн сард нэмэгдсэн",
      text: "text-violet-600",
      bg: "from-violet-500/15 to-violet-100/40",
    },
    {
      title: "Эд зүйлээ олсон хүн",
      value: stats.recoveredUsers,
      desc: "Батлагдсан олголтоор",
      text: "text-emerald-600",
      bg: "from-emerald-500/15 to-emerald-100/40",
    },
  ];

  return (
    <section className="relative -mt-10 z-10 px-4 pb-8 md:px-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-md md:p-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              Платформын үзүүлэлт
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Манай сайтын статистик
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-500">
            Сайт дээрх одоогийн өгөгдөл дээр үндэслэн автоматаар тооцоолсон
            үзүүлэлтүүд.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl border border-white/70 bg-gradient-to-br ${item.bg} p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
            >
              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <p className={`mt-3 text-4xl font-extrabold ${item.text}`}>
                {item.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}