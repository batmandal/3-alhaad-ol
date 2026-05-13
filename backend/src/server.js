require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { connectDB } = require("./config/db")
const { notFound, errorHandler } = require("./middleware/errorHandler")

const app = express()

app.use(express.json({ limit: "1mb" }))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
)
app.use(morgan("dev"))

app.get("/health", (req, res) => res.json({ ok: true, service: "lost-found-backend" }))

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/posts", require("./routes/postRoutes"))
app.use("/api/claims", require("./routes/claimRoutes"))
app.use("/api/withdrawals", require("./routes/withdrawalRoutes"))
app.use("/api/faq", require("./routes/faqRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

app.use(notFound)
app.use(errorHandler)

const PORT = Number(process.env.PORT) || 8080

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("[server] failed to start:", err)
    process.exit(1)
  }
}

start()