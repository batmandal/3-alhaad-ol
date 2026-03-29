"use client"

import { DAILY_NEW_USERS, LOCATION_STATS } from "@/lib/admin-mock-data"

export default function ReportsPage() {
  const maxUsers = Math.max(...DAILY_NEW_USERS.map((d) => d.count))
  const lostPercent = 60
  const foundPercent = 40

  return (
    <div className="admin-page-grid">
      <div className="admin-reports-grid">
        {/* Daily New Users Chart */}
        <div className="admin-chart-card">
          <h2 className="admin-chart-title">Өдрийн шинэ хэрэглэгч</h2>
          <p className="admin-chart-subtitle">Сүүлийн 7 хоног</p>
          <div className="admin-bar-chart">
            {DAILY_NEW_USERS.map((d) => (
              <div key={d.day} className="admin-bar-col">
                <div className="admin-bar-value">{d.count}</div>
                <div
                  className="admin-bar"
                  style={{ height: `${(d.count / maxUsers) * 100}%` }}
                />
                <div className="admin-bar-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart - Lost vs Found */}
        <div className="admin-chart-card">
          <h2 className="admin-chart-title">Хаясан vs Олсон</h2>
          <p className="admin-chart-subtitle">Нийт зарын харьцаа</p>
          <div className="admin-pie-container">
            <div
              className="admin-pie"
              style={{
                background: `conic-gradient(
                  #2E86DE 0% ${lostPercent}%,
                  #27AE60 ${lostPercent}% 100%
                )`,
              }}
            >
              <div className="admin-pie-inner" />
            </div>
            <div className="admin-pie-legend">
              <div className="admin-pie-legend-item">
                <span className="admin-pie-dot" style={{ backgroundColor: "#2E86DE" }} />
                Хаясан — {lostPercent}%
              </div>
              <div className="admin-pie-legend-item">
                <span className="admin-pie-dot" style={{ backgroundColor: "#27AE60" }} />
                Олсон — {foundPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Heatmap */}
      <div className="admin-chart-card">
        <h2 className="admin-chart-title">Байршлаар</h2>
        <p className="admin-chart-subtitle">Хамгийн их зар нийтлэгдсэн газрууд</p>
        <div className="admin-location-bars">
          {LOCATION_STATS.map((loc) => (
            <div key={loc.name} className="admin-location-row">
              <span className="admin-location-name">{loc.name}</span>
              <div className="admin-location-track">
                <div
                  className="admin-location-fill"
                  style={{ width: `${loc.percent}%` }}
                />
              </div>
              <span className="admin-location-val">{loc.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
