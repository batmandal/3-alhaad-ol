"use client"

// ECMAScript 6: import
import { useState, useEffect, useCallback } from "react"
import type { FaqItem } from "@/lib/faq-data"
import { FAQ_CATEGORIES } from "@/lib/faq-data"

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | "all">("all")
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ECMAScript 6: fetch() + Promise .then() chain
  // useCallback ашигласнаар функцийг useEffect-н dependency болгож болно
  const fetchFaqs = useCallback((category: FaqItem["category"] | "all") => {
    const url = category === "all" ? "/api/faq" : `/api/faq?category=${category}`

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setFaqs(Array.isArray(json.data) ? json.data : [])
        setLoading(false)
      })
      .catch(() => {
        setFaqs([])
        setLoading(false)
      })
  }, [])

  // Хуудас нээгдэх үед болон ангилал өөрчлөгдөх үед дата татна
  useEffect(() => {
    fetchFaqs(activeCategory)
  }, [activeCategory, fetchFaqs])

  const handleCategoryChange = (cat: FaqItem["category"] | "all") => {
    setLoading(true)
    setActiveCategory(cat)
  }

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Түгээмэл асуулт хариулт</h2>
      <p className="text-center text-sm text-muted-foreground mb-8">
        Сайтыг ашиглахтай холбоотой нийтлэг асуултуудын хариулт
      </p>

      {/* Ангиллын шүүлтүүр */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            activeCategory === "all"
              ? "bg-teal-500 text-white border-teal-500"
              : "border-border text-muted-foreground hover:border-teal-400"
          }`}
        >
          Бүгд
        </button>
        {(Object.keys(FAQ_CATEGORIES) as FaqItem["category"][]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat
                ? "bg-teal-500 text-white border-teal-500"
                : "border-border text-muted-foreground hover:border-teal-400"
            }`}
          >
            {FAQ_CATEGORIES[cat]}
          </button>
        ))}
      </div>

      {/* Асуулт хариултууд */}
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Ачааллаж байна...</div>
      ) : (
        <div className="space-y-3">
          {faqs.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                className="w-full text-left px-5 py-4 font-medium flex justify-between items-center hover:bg-muted/40 transition-colors"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                <span>{item.question}</span>
                <span className="ml-4 text-teal-500 text-lg">
                  {openId === item.id ? "−" : "+"}
                </span>
              </button>
              {openId === item.id && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
