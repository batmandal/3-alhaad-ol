function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
}

function errorHandler(err, req, res, next) {
  console.error("[error]", err)
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message, details: err.errors })
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate key", keys: err.keyValue })
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" })
}

module.exports = { notFound, errorHandler }
