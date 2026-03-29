"use client"

import { Megaphone, Users, Wallet, TrendingUp } from "lucide-react"
import { ADMIN_STATS, DAILY_AD_POSTINGS } from "@/lib/admin-mock-data"

const STAT_CARDS = [
  {
    label: "Нийт зарууд",
    value: ADMIN_STATS.totalAds.toLocaleString(),
    change: `+${ADMIN_STATS.totalAdsToday} өнөөдөр`,
    icon: Megaphone,
    color: "#2E86DE",
  },
  {
    label: "Шинэ хэрэглэгчид",
    value: ADMIN_STATS.newUsers.toString(),
    change: `+${ADMIN_STATS.newUsersToday} өнөөдөр`,
    icon: Users,
    color: "#27AE60",
  },
  {
    label: "Escrow үлдэгдэл",
    value: `₮${(ADMIN_STATS.escrowBalance / 1000000).toFixed(1)}M`,
    change: "Идэвхтэй",
    icon: Wallet,
    color: "#E8A000",
  },
  {
    label: "Өнөөдрийн орлого",
    value: `₮${ADMIN_STATS.todayIncome.toLocaleString()}`,
    change: `${ADMIN_STATS.feePercent}% шимтгэл`,
    icon: TrendingUp,
    color: "#8E6FD8",
  },
]

export default function DashboardPage() {
  const maxCount = Math.max(...DAILY_AD_POSTINGS.map((d) => d.count))

  return (
    <div className="admin-page-grid">
      {/* Stat Cards */}
      <div className="admin-stat-cards">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-card-header">
              <span className="admin-stat-card-label">{card.label}</span>
              <span
                className="admin-stat-card-icon"
                style={{ backgroundColor: card.color + "22", color: card.color }}
              >
                <card.icon size={20} />
              </span>
            </div>
            <div className="admin-stat-card-value">{card.value}</div>
            <div className="admin-stat-card-change" style={{ color: card.color }}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="admin-chart-card">
        <h2 className="admin-chart-title">Өдрийн зар нийтлэл</h2>
        <p className="admin-chart-subtitle">Сүүлийн 7 хоног</p>
        <div className="admin-bar-chart">
          {DAILY_AD_POSTINGS.map((d) => (
            <div key={d.day} className="admin-bar-col">
              <div className="admin-bar-value">{d.count}</div>
              <div
                className="admin-bar"
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              />
              <div className="admin-bar-label">{d.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
