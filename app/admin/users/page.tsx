"use client"

import { useState } from "react"
import { Search, MoreVertical } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"

export default function UsersPage() {
  const { users } = useAppStore()
  const [search, setSearch] = useState("")

  // Mock statuses for users
  const userStatuses: Record<string, "active" | "blocked"> = {
    "u-admin": "active",
    "u-1": "active",
    "u-2": "active",
    "u-3": "blocked",
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-page-grid">
      {/* Search */}
      <div className="admin-table-toolbar">
        <div className="admin-header-search" style={{ maxWidth: 360 }}>
          <Search className="admin-header-search-icon" />
          <input
            type="text"
            placeholder="Хэрэглэгч хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-header-search-input"
          />
        </div>
        <span className="admin-table-count">{filtered.length} хэрэглэгч</span>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Нэр</th>
              <th>Имэйл</th>
              <th>Утас</th>
              <th>SISI ID</th>
              <th>Төлөв</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const status = userStatuses[u.id] ?? "active"
              return (
                <tr key={u.id}>
                  <td className="admin-table-user">
                    <span className="admin-table-avatar">
                      {u.name.charAt(0)}
                    </span>
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td className="admin-table-mono">{u.sisiId}</td>
                  <td>
                    <span
                      className={
                        status === "active"
                          ? "admin-badge admin-badge--green"
                          : "admin-badge admin-badge--red"
                      }
                    >
                      {status === "active" ? "ИДЭВХТЭЙ" : "ХОРИГЛОСОН"}
                    </span>
                  </td>
                  <td>
                    <button className="admin-icon-btn" aria-label="Дэлгэрэнгүй">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
