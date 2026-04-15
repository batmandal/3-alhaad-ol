"use client"

// ECMAScript 6: import ашиглан lib/faq-data.ts файлаас статик JSON дата оруулж ирж байна
import { FAQ_DATA, FAQ_CATEGORIES, type FaqItem } from "@/lib/faq-data"
import { useState } from "react"

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | "all">("all")
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered =
    activeCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((f) => f.category === activeCategory)

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Түгээмэл асуулт хариулт</h2>
      <p className="text-center text-sm text-muted-foreground mb-8">
        Сайтыг ашиглахтай холбоотой нийтлэг асуултуудын хариулт
      </p>

      {/* Ангиллын шүүлтүүр */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => setActiveCategory("all")}
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
            onClick={() => setActiveCategory(cat)}
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
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              className="w-full text-left px-5 py-4 font-medium flex justify-between items-center hover:bg-muted/40 transition-colors"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <span>{item.question}</span>
              <span className="ml-4 text-teal-500 text-lg">{openId === item.id ? "−" : "+"}</span>
            </button>
            {openId === item.id && (
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
