"use client"

import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from "lucide-react"
import { MOCK_TRANSACTIONS } from "@/lib/admin-mock-data"

const SUMMARY = {
  total: 342,
  monthlyVolume: 2450000,
  pending: MOCK_TRANSACTIONS.filter(t => t.status === "pending").length,
  completed: MOCK_TRANSACTIONS.filter(t => t.status === "completed").length,
}

export default function TransactionsPage() {
  return (
    <div className="admin-page-grid">
      {/* Summary cards */}
      <div className="admin-stat-cards admin-stat-cards--3">
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <span className="admin-stat-card-label">Нийт гүйлгээ</span>
            <span className="admin-stat-card-icon" style={{ backgroundColor: "#2E86DE22", color: "#2E86DE" }}>
              <Wallet size={20} />
            </span>
          </div>
          <div className="admin-stat-card-value">{SUMMARY.total}</div>
          <div className="admin-stat-card-change" style={{ color: "#2E86DE" }}>
            {SUMMARY.completed} дууссан · {SUMMARY.pending} хүлээгдэж
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <span className="admin-stat-card-label">Сарын эргэлт</span>
            <span className="admin-stat-card-icon" style={{ backgroundColor: "#27AE6022", color: "#27AE60" }}>
              <TrendingUp size={20} />
            </span>
          </div>
          <div className="admin-stat-card-value">₮{(SUMMARY.monthlyVolume / 1000000).toFixed(1)}M</div>
          <div className="admin-stat-card-change" style={{ color: "#27AE60" }}>
            +12% өмнөх сараас
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Гүйлгээний ID</th>
              <th>Хэрэглэгч</th>
              <th>Төрөл</th>
              <th>Дүн</th>
              <th>Огноо</th>
              <th>Төлөв</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TRANSACTIONS.map((t) => (
              <tr key={t.id}>
                <td className="admin-table-mono">{t.id}</td>
                <td>{t.userName}</td>
                <td>
                  <span className="admin-txn-type">
                    {t.type === "escrow_deposit" && (
                      <>
                        <ArrowDownLeft size={14} className="admin-txn-icon admin-txn-icon--in" />
                        Escrow орлого
                      </>
                    )}
                    {t.type === "escrow_release" && (
                      <>
                        <ArrowUpRight size={14} className="admin-txn-icon admin-txn-icon--out" />
                        Escrow гаргалт
                      </>
                    )}
                    {t.type === "fee" && (
                      <>
                        <TrendingUp size={14} className="admin-txn-icon admin-txn-icon--fee" />
                        Шимтгэл
                      </>
                    )}
                  </span>
                </td>
                <td>₮{t.amount.toLocaleString()}</td>
                <td>{t.date}</td>
                <td>
                  <span
                    className={`admin-badge ${
                      t.status === "completed"
                        ? "admin-badge--green"
                        : t.status === "pending"
                        ? "admin-badge--yellow"
                        : "admin-badge--red"
                    }`}
                  >
                    {t.status === "completed" ? "Дууссан" : t.status === "pending" ? "Хүлээгдэж" : "Амжилтгүй"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
