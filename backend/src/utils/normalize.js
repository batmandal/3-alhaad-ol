function normalizeAnswer(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ")
}

module.exports = { normalizeAnswer }
