"use client"

import { useState } from "react"
import { Check, Search, SlidersHorizontal, X } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { MOCK_CATEGORIES, MOCK_LOCATIONS } from "@/lib/mock-data"

function getStatusLabel(status: string) {
  if (status === "published") return "Нийтлэгдсэн"
  if (status === "pending_payment") return "Төлбөр хүлээгдэж байна"
  if (status === "rejected") return "Татгалзсан"
  return status
}

function getStatusBadgeClass(status: string) {
  if (status === "published") return "admin-badge admin-badge--green"
  if (status === "pending_payment") return "admin-badge admin-badge--yellow"
  if (status === "rejected") return "admin-badge admin-badge--red"
  return "admin-badge admin-badge--blue"
}

export default function AdsPage() {
  const { posts, getUserById, updatePostStatus } = useAppStore()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())

    const matchCategory = !categoryFilter || p.category === categoryFilter
    const matchLocation = !locationFilter || p.location === locationFilter
    const matchStatus = !statusFilter || p.status === statusFilter

    return matchSearch && matchCategory && matchLocation && matchStatus
  })

  return (
    <div className="admin-page-grid">
      <div className="admin-table-toolbar">
        <div className="admin-header-search" style={{ maxWidth: 320 }}>
          <Search className="admin-header-search-icon" />
          <input
            type="text"
            placeholder="Зар хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-header-search-input"
          />
        </div>

        <div className="admin-filters">
          <SlidersHorizontal size={16} className="admin-filters-icon" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Бүх төлөв</option>
            <option value="pending_payment">Төлбөр хүлээгдэж байна</option>
            <option value="published">Нийтлэгдсэн</option>
            <option value="rejected">Татгалзсан</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Бүх ангилал</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Бүх байршил</option>
            {MOCK_LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-ad-grid">
        {filtered.map((p) => {
          const author = getUserById(p.authorId)

          return (
            <div key={p.id} className="admin-ad-card">
              <div className="admin-ad-card-img">
                <img src={p.imageUrl} alt={p.title} />

                <span
                  className={
                    p.type === "lost"
                      ? "admin-ad-type admin-ad-type--lost"
                      : "admin-ad-type admin-ad-type--found"
                  }
                >
                  {p.type === "lost" ? "Хаясан" : "Олсон"}
                </span>
              </div>

              <div className="admin-ad-card-body">
                <h3 className="admin-ad-card-title">{p.title}</h3>

                <p className="admin-ad-card-meta">
                  {p.location} · {p.date}
                </p>

                <div className="admin-ad-card-footer">
                  <span className="admin-ad-card-author">
                    {author?.name ?? p.authorId}
                  </span>

                  <span className={getStatusBadgeClass(p.status)}>
                    {getStatusLabel(p.status)}
                  </span>
                </div>

                {p.status === "pending_payment" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 14,
                    }}
                  >
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--approve"
                      onClick={() => updatePostStatus(p.id, "published")}
                    >
                      <Check size={14} />
                      Баталгаажуулах
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--reject"
                      onClick={() => updatePostStatus(p.id, "rejected")}
                    >
                      <X size={14} />
                      Татгалзах
                    </button>
                  </div>
                )}

                {p.status === "rejected" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 14,
                    }}
                  >
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--approve"
                      onClick={() => updatePostStatus(p.id, "published")}
                    >
                      <Check size={14} />
                      Дахин нийтлэх
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}