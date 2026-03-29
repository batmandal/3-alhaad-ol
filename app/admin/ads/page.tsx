"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { MOCK_CATEGORIES, MOCK_LOCATIONS } from "@/lib/mock-data"

export default function AdsPage() {
  const { posts, getUserById } = useAppStore()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || p.category === categoryFilter
    const matchLocation = !locationFilter || p.location === locationFilter
    return matchSearch && matchCategory && matchLocation
  })

  return (
    <div className="admin-page-grid">
      {/* Toolbar */}
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Бүх ангилал</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Бүх байршил</option>
            {MOCK_LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ad Grid */}
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
                  <span
                    className={`admin-badge ${
                      p.status === "published"
                        ? "admin-badge--green"
                        : "admin-badge--yellow"
                    }`}
                  >
                    {p.status === "published" ? "Нийтлэгдсэн" : p.status}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
