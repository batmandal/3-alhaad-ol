"use client"

import { useState, useEffect } from "react"
import { API_BASE } from "@/lib/api"

interface Post {
  id: string
  title: string
  description: string
  category: string
  location: string
  type: "lost" | "found"
  imageUrl: string
}

export default function PostsLivePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/posts`)
      .then((res) => {
        if (!res.ok) throw new Error(`Серверийн алдаа: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setPosts(Array.isArray(data.data) ? data.data : [])
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Лаб 7: MongoDB-аас шууд татсан өгөгдөл
        </h1>

        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-6">
            Backend (MongoDB) дээрх нийт{" "}
            <span className="font-semibold text-gray-700">{posts.length}</span>{" "}
            зар
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 text-lg mt-20">
            Ачааллаж байна...
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-6">
            <p className="font-semibold">Алдаа гарлаа:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    Зураг байхгүй
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {post.title}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        post.type === "lost"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {post.type === "lost" ? "Гээгдсэн" : "Олдсон"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span>📍 {post.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-gray-400">
          Эх сурвалж: {API_BASE}/api/posts (Express + MongoDB)
        </footer>
      </div>
    </main>
  )
}
