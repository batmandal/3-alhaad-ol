"use client"

import { useState } from "react"
import { Check, X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag, User } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"

export default function ReviewPage() {
  const { posts, getUserById } = useAppStore()
  const [selectedIdx, setSelectedIdx] = useState(0)

  // Show all posts for review
  const reviewPosts = posts
  const post = reviewPosts[selectedIdx]

  if (!post) {
    return (
      <div className="admin-empty-state">
        <p>Хянах зар байхгүй.</p>
      </div>
    )
  }

  const author = getUserById(post.authorId)

  return (
    <div className="admin-review-layout">
      {/* Left: Image gallery */}
      <div className="admin-review-gallery">
        <div className="admin-review-img-wrap">
          <img src={post.imageUrl} alt={post.title} className="admin-review-img" />
          <span
            className={
              post.type === "lost"
                ? "admin-ad-type admin-ad-type--lost"
                : "admin-ad-type admin-ad-type--found"
            }
          >
            {post.type === "lost" ? "Хаясан" : "Олсон"}
          </span>
        </div>
        {/* Navigation */}
        <div className="admin-review-nav">
          <button
            className="admin-icon-btn"
            disabled={selectedIdx === 0}
            onClick={() => setSelectedIdx((i) => i - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="admin-review-counter">
            {selectedIdx + 1} / {reviewPosts.length}
          </span>
          <button
            className="admin-icon-btn"
            disabled={selectedIdx === reviewPosts.length - 1}
            onClick={() => setSelectedIdx((i) => i + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Right: Info panel */}
      <div className="admin-review-info">
        <h2 className="admin-review-title">{post.title}</h2>

        <div className="admin-review-details">
          <div className="admin-review-detail">
            <User size={16} className="admin-review-detail-icon" />
            <span className="admin-review-detail-label">Оруулсан:</span>
            <span>{author?.name ?? post.authorId}</span>
          </div>
          <div className="admin-review-detail">
            <MapPin size={16} className="admin-review-detail-icon" />
            <span className="admin-review-detail-label">Байршил:</span>
            <span>{post.location}</span>
          </div>
          <div className="admin-review-detail">
            <Calendar size={16} className="admin-review-detail-icon" />
            <span className="admin-review-detail-label">Огноо:</span>
            <span>{post.date}</span>
          </div>
          <div className="admin-review-detail">
            <Tag size={16} className="admin-review-detail-icon" />
            <span className="admin-review-detail-label">Ангилал:</span>
            <span>{post.category}</span>
          </div>
        </div>

        <div className="admin-review-desc">
          <h3 className="admin-review-desc-title">Тайлбар</h3>
          <p>{post.description}</p>
        </div>

        {post.rewardAmount && (
          <div className="admin-review-reward">
            Шагнал: ₮{post.rewardAmount.toLocaleString()}
          </div>
        )}

        {post.verificationQuestion && (
          <div className="admin-review-verification">
            <h4>Баталгаажуулах асуулт:</h4>
            <p>{post.verificationQuestion}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="admin-review-actions">
          <button className="admin-btn admin-btn--approve">
            <Check size={18} />
            Зөвшөөрөх
          </button>
          <button className="admin-btn admin-btn--reject">
            <X size={18} />
            Татгалзах
          </button>
        </div>
      </div>
    </div>
  )
}
