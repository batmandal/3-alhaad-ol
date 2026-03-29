/* ─── Mock data for admin panel ─── */

export interface AdminTransaction {
  id: string
  userId: string
  userName: string
  amount: number
  type: "escrow_deposit" | "escrow_release" | "fee"
  status: "completed" | "pending" | "failed"
  date: string
}

export interface SecurityLogEntry {
  id: string
  timestamp: string
  email: string
  action: string
  severity: "info" | "warning" | "critical"
  ip?: string
}

export const ADMIN_STATS = {
  totalAds: 1248,
  totalAdsToday: 24,
  newUsers: 38,
  newUsersToday: 12,
  escrowBalance: 4200000,
  todayIncome: 18400,
  feePercent: 2,
}

export const DAILY_AD_POSTINGS = [
  { day: "Дав", count: 32 },
  { day: "Мяг", count: 45 },
  { day: "Лха", count: 28 },
  { day: "Пүр", count: 51 },
  { day: "Баа", count: 38 },
  { day: "Бям", count: 18 },
  { day: "Ням", count: 12 },
]

export const DAILY_NEW_USERS = [
  { day: "Дав", count: 8 },
  { day: "Мяг", count: 14 },
  { day: "Лха", count: 6 },
  { day: "Пүр", count: 12 },
  { day: "Баа", count: 10 },
  { day: "Бям", count: 5 },
  { day: "Ням", count: 3 },
]

export const LOCATION_STATS = [
  { name: "МУИС Номын сан", percent: 32 },
  { name: "1-р байр", percent: 24 },
  { name: "2-р байр", percent: 18 },
  { name: "Спорт заал", percent: 14 },
  { name: "Үндсэн коридор", percent: 8 },
  { name: "Идэвхтэн амралт", percent: 4 },
]

export const MOCK_TRANSACTIONS: AdminTransaction[] = [
  { id: "TXN-001", userId: "u-1", userName: "Болд Оюутан", amount: 50000, type: "escrow_deposit", status: "completed", date: "2026-03-28" },
  { id: "TXN-002", userId: "u-2", userName: "Сараа Эрдэнэ", amount: 80000, type: "escrow_deposit", status: "completed", date: "2026-03-27" },
  { id: "TXN-003", userId: "u-1", userName: "Болд Оюутан", amount: 1000, type: "fee", status: "completed", date: "2026-03-27" },
  { id: "TXN-004", userId: "u-3", userName: "Тэмүүлэн Бат", amount: 30000, type: "escrow_release", status: "pending", date: "2026-03-26" },
  { id: "TXN-005", userId: "u-2", userName: "Сараа Эрдэнэ", amount: 1600, type: "fee", status: "completed", date: "2026-03-26" },
  { id: "TXN-006", userId: "u-1", userName: "Болд Оюутан", amount: 120000, type: "escrow_deposit", status: "completed", date: "2026-03-25" },
  { id: "TXN-007", userId: "u-3", userName: "Тэмүүлэн Бат", amount: 15000, type: "escrow_release", status: "completed", date: "2026-03-25" },
  { id: "TXN-008", userId: "u-2", userName: "Сараа Эрдэнэ", amount: 40000, type: "escrow_deposit", status: "failed", date: "2026-03-24" },
]

export const MOCK_SECURITY_LOGS: SecurityLogEntry[] = [
  { id: "sec-1", timestamp: "2026-03-28 14:32", email: "unknown@gmail.com", action: "МУИС-ийн бус имэйлээр нэвтрэх оролдлого", severity: "critical", ip: "203.91.115.44" },
  { id: "sec-2", timestamp: "2026-03-28 13:10", email: "bold@num.edu.mn", action: "7 удаа 2FA код алдсан", severity: "critical", ip: "10.0.1.55" },
  { id: "sec-3", timestamp: "2026-03-28 11:45", email: "saraa@num.edu.mn", action: "Амжилттай нэвтэрсэн", severity: "info", ip: "10.0.2.101" },
  { id: "sec-4", timestamp: "2026-03-27 16:20", email: "temuulen@num.edu.mn", action: "Нууц үг солисон", severity: "info", ip: "10.0.3.88" },
  { id: "sec-5", timestamp: "2026-03-27 09:55", email: "admin@num.edu.mn", action: "Админ хэрэглэгч нэмсэн", severity: "warning", ip: "10.0.0.1" },
  { id: "sec-6", timestamp: "2026-03-26 22:15", email: "nouser@yahoo.com", action: "МУИС-ийн бус имэйлээр нэвтрэх оролдлого", severity: "warning", ip: "45.33.17.99" },
  { id: "sec-7", timestamp: "2026-03-26 18:30", email: "bold@num.edu.mn", action: "Амжилттай нэвтэрсэн", severity: "info", ip: "10.0.1.55" },
  { id: "sec-8", timestamp: "2026-03-26 10:00", email: "saraa@num.edu.mn", action: "2FA идэвхжүүлсэн", severity: "info", ip: "10.0.2.101" },
]
