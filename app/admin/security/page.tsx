"use client"

import { ShieldAlert, Ban } from "lucide-react"
import { MOCK_SECURITY_LOGS } from "@/lib/admin-mock-data"

export default function SecurityPage() {
  const criticalCount = MOCK_SECURITY_LOGS.filter(
    (l) => l.severity === "critical"
  ).length

  return (
    <div className="admin-page-grid">
      {/* Alert banner */}
      {criticalCount > 0 && (
        <div className="admin-alert admin-alert--danger">
          <ShieldAlert size={20} />
          <span>{criticalCount} Аюултай анхааруулга</span>
        </div>
      )}

      {/* Security table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Цаг</th>
              <th>Имэйл</th>
              <th>Үйлдэл</th>
              <th>IP хаяг</th>
              <th>Түвшин</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SECURITY_LOGS.map((log) => (
              <tr
                key={log.id}
                className={
                  log.severity === "critical" ? "admin-table-row--critical" : ""
                }
              >
                <td className="admin-table-mono" style={{ whiteSpace: "nowrap" }}>{log.timestamp}</td>
                <td>{log.email}</td>
                <td>{log.action}</td>
                <td className="admin-table-mono">{log.ip ?? "—"}</td>
                <td>
                  <span
                    className={`admin-badge ${
                      log.severity === "critical"
                        ? "admin-badge--red"
                        : log.severity === "warning"
                        ? "admin-badge--yellow"
                        : "admin-badge--blue"
                    }`}
                  >
                    {log.severity === "critical"
                      ? "Аюултай"
                      : log.severity === "warning"
                      ? "Анхааруулга"
                      : "Мэдээлэл"}
                  </span>
                </td>
                <td>
                  {(log.severity === "critical" || log.severity === "warning") && (
                    <button className="admin-btn admin-btn--sm admin-btn--reject">
                      <Ban size={14} />
                      Хаах
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
