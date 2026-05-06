require("dotenv").config()
const mongoose = require("mongoose")
const { connectDB } = require("../config/db")
const User = require("../models/User")
const Post = require("../models/Post")
const Faq = require("../models/Faq")
const Transaction = require("../models/Transaction")
const SecurityLog = require("../models/SecurityLog")

const SEED_USERS = [
  { sisiId: "20b1num0001", phone: "99110011", email: "admin@num.edu.mn", name: "Админ Хэрэглэгч", isAdmin: true, password: "admin" },
  { sisiId: "21b1num0123", phone: "88112233", email: "bold@num.edu.mn", facebook: "bold.num", name: "Болд Оюутан", password: "demo" },
  { sisiId: "20b1num0456", phone: "89991122", email: "saraa@num.edu.mn", name: "Сараа Эрдэнэ", password: "demo" },
  { sisiId: "22b1num0234", phone: "88119900", email: "temuulen@num.edu.mn", name: "Тэмүүлэн Бат", password: "demo" },
  { sisiId: "24b1num3456", phone: "88000000", email: "engin@num.edu.mn", name: "Хэрэглэгч", password: "1234" },
]

const SEED_POSTS = [
  {
    type: "lost", title: "AirPods Pro алдсан",
    description: "Цайвар кейстэй, номын сан 3 давхарт сүүлд харагдсан. Шагналтай.",
    category: "Утас, таблет", location: "Номын сан", date: "2026-03-20",
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80",
    authorEmail: "bold@num.edu.mn", status: "published", rewardAmount: 50000,
    verificationQuestion: "AirPods-ийн device нэр нь юу вэ?", correctAnswer: "Boldiin AirPods",
  },
  {
    type: "found", title: "Түрийвч олдсон",
    description: "2-р байрын орцонд хар торгоны түрийвч.",
    category: "Үнэт эдлэл", location: "2-р байр", date: "2026-03-22",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    authorEmail: "admin@num.edu.mn", status: "published",
    verificationQuestion: "Дотор нь хэдэн карт байсан бэ?", correctAnswer: "2",
    finderRewardAmount: 30000,
  },
  {
    type: "lost", title: "Физикийн ном (IV том)",
    description: "Ногоон хавтас, гарын үсэгтэй.",
    category: "Дэвтэр, ном", location: "1-р байр", date: "2026-03-18",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    authorEmail: "bold@num.edu.mn", status: "published",
    verificationQuestion: "Номын эхний хуудсан дээрх нэрийн эхний үсэг юу вэ?", correctAnswer: "Б",
  },
  {
    type: "found", title: "Түлхүүр олдсон",
    description: "NUM лого бүхий түлхүүр.",
    category: "Бусад", location: "2-р байр", date: "2026-03-24",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    authorEmail: "bold@num.edu.mn", status: "published",
    verificationQuestion: "Түлхүүрийн оосор ямар өнгөтэй вэ?", correctAnswer: "хар",
  },
  {
    type: "lost", title: "Samsung Galaxy утас",
    description: "Хар гэртэй, баруун доод буланд нь хагаралтай.",
    category: "Утас, таблет", location: "Спорт заал", date: "2026-03-15",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    authorEmail: "saraa@num.edu.mn", status: "published", rewardAmount: 80000,
    verificationQuestion: "Утасны дэлгэцийн хагарал аль буланд байсан бэ?", correctAnswer: "баруун доод",
  },
  {
    type: "found", title: "Хар шүхэр",
    description: "Номын сангаас гарах үед суудал дээр үлдсэн.",
    category: "Бусад", location: "Номын сан", date: "2026-03-21",
    imageUrl: "https://images.unsplash.com/photo-1523772721666-22ad3c3b6f90?w=600&q=80",
    authorEmail: "temuulen@num.edu.mn", status: "published",
    verificationQuestion: "Хэдэн эгнээтэй вэ?", correctAnswer: "8",
  },
]

const SEED_FAQS = [
  { question: "Зар нийтлэхийн тулд юу хийх хэрэгтэй вэ?", answer: "МУИС-ийн имэйл хаягаар бүртгүүлж, нэвтэрсний дараа 'Алдсан зар' эсвэл 'Олдсон зар' товчийг дарна уу.", category: "general" },
  { question: "Зараа нийтлэхэд мөнгө төлөх шаардлагатай юу?", answer: "Олдсон зүйл мэдэгдэх зар үнэгүй. Алдсан зүйлийн зарт шагнал тогтоосон тохиолдолд escrow хадгаламж шаардлагатай.", category: "general" },
  { question: "Алдсан зүйлээ хэрхэн эрэх вэ?", answer: "Нүүр хуудасны хайлтаар зарын нэр, ангилал, байршлаар шүүж хайна уу.", category: "lost" },
  { question: "Олдсон зүйлийг буцааж авахын тулд юу хийх вэ?", answer: "Зарын дэлгэрэнгүй хуудсанд баталгаажуулах асуултад хариулна уу. Зөв хариулсан тохиолдолд эзэмшигчтэй холбоо барих мэдээлэл нээгдэнэ.", category: "found" },
  { question: "Шагналын мөнгийг хэрхэн авах вэ?", answer: "Алдсан зүйлийг буцааж өгсний дараа зарын эзэн таны claim-ийг баталгаажуулна. Дараа нь профайлаас банкны мэдээлэл оруулж мөнгөө татаж авна.", category: "reward" },
  { question: "Зарыг хэн нийтлэх эрхтэй вэ?", answer: "Зөвхөн @num.edu.mn МУИС-ийн имэйлтэй хэрэглэгчид зар нийтлэх боломжтой.", category: "general" },
  { question: "Буруу мэдээлэл агуулсан зарыг хэрхэн мэдэгдэх вэ?", answer: "Зарын дэлгэрэнгүй хуудаснаас 'Мэдэгдэх' товч дарж шалтгаанаа тайлбарлана уу.", category: "general" },
  { question: "Шагналын escrow систем гэж юу вэ?", answer: "Шагналын мөнгийг урьдчилан системд хадгалуулж, зүйл буцаагдсаны дараа автоматаар олсон хүнд шилжүүлдэг.", category: "reward" },
]

const SEED_TRANSACTIONS = [
  { userName: "Болд Оюутан", amount: 50000, type: "escrow_deposit", status: "completed", date: "2026-03-28" },
  { userName: "Сараа Эрдэнэ", amount: 80000, type: "escrow_deposit", status: "completed", date: "2026-03-27" },
  { userName: "Болд Оюутан", amount: 1000, type: "fee", status: "completed", date: "2026-03-27" },
  { userName: "Тэмүүлэн Бат", amount: 30000, type: "escrow_release", status: "pending", date: "2026-03-26" },
  { userName: "Сараа Эрдэнэ", amount: 1600, type: "fee", status: "completed", date: "2026-03-26" },
]

const SEED_SECURITY_LOGS = [
  { timestamp: "2026-03-28 14:32", email: "unknown@gmail.com", action: "МУИС-ийн бус имэйлээр нэвтрэх оролдлого", severity: "critical", ip: "203.91.115.44" },
  { timestamp: "2026-03-28 13:10", email: "bold@num.edu.mn", action: "7 удаа 2FA код алдсан", severity: "critical", ip: "10.0.1.55" },
  { timestamp: "2026-03-28 11:45", email: "saraa@num.edu.mn", action: "Амжилттай нэвтэрсэн", severity: "info", ip: "10.0.2.101" },
  { timestamp: "2026-03-27 16:20", email: "temuulen@num.edu.mn", action: "Нууц үг солисон", severity: "info", ip: "10.0.3.88" },
  { timestamp: "2026-03-27 09:55", email: "admin@num.edu.mn", action: "Админ хэрэглэгч нэмсэн", severity: "warning", ip: "10.0.0.1" },
]

async function run() {
  await connectDB()
  console.log("[seed] clearing existing data...")
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Faq.deleteMany({}),
    Transaction.deleteMany({}),
    SecurityLog.deleteMany({}),
  ])

  console.log("[seed] inserting users...")
  const users = []
  for (const u of SEED_USERS) users.push(await User.create(u))
  const byEmail = Object.fromEntries(users.map((u) => [u.email, u]))

  console.log("[seed] inserting posts...")
  for (const p of SEED_POSTS) {
    const author = byEmail[p.authorEmail]
    if (!author) continue
    const { authorEmail, ...rest } = p
    await Post.create({ ...rest, author: author._id })
  }

  console.log("[seed] inserting faqs...")
  await Faq.insertMany(SEED_FAQS)

  console.log("[seed] inserting transactions...")
  await Transaction.insertMany(SEED_TRANSACTIONS)

  console.log("[seed] inserting security logs...")
  await SecurityLog.insertMany(SEED_SECURITY_LOGS)

  console.log("[seed] done.")
  await mongoose.disconnect()
}

run().catch(async (err) => {
  console.error("[seed] failed:", err)
  await mongoose.disconnect()
  process.exit(1)
})
