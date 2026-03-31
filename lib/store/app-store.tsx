"use client"

import * as React from "react"
import {
  INITIAL_POSTS,
  INITIAL_USERS,
  INITIAL_WITHDRAWALS,
} from "@/lib/mock-data"
import type { Post, PostStatus, RewardEligibility, User, WithdrawalRequest, Claim, ClaimStatus } from "@/lib/types"


interface AppState {
  users: User[]
  posts: Post[]
  withdrawals: WithdrawalRequest[]
  claims: Claim[]
  currentUser: User | null
  rewardEligibilities: Record<string, RewardEligibility[]>
}

interface AppContextValue extends AppState {
  login: (phoneOrEmail: string, password: string) => { ok: boolean; message?: string }
  signup: (payload: {
    sisiId: string
    phone: string
    email: string
    password: string
    facebook?: string
    name: string
  }) => { ok: boolean; message?: string }
  logout: () => void
  addPost: (post: Omit<Post, "id" | "status"> & { status?: PostStatus }) => Post
  updatePostStatus: (id: string, status: PostStatus) => void
  /** Хүсэлт бүү - олсон эд зүйлийн асуултуудад хариулну */
  submitClaim: (payload: {
    postId: string
    answers: string[]
  }) => { ok: boolean; message?: string; claimId?: string }
  /** Админ - хүсэлтийг approve эсвэл reject хийнэ */
  reviewClaim: (claimId: string, status: ClaimStatus, notes?: string) => void
  submitWithdrawal: (payload: {
    postId: string
    amount: number
    bankName: string
    accountNumber: string
  }) => void
  completeWithdrawal: (id: string) => void
  getUserById: (id: string) => User | undefined
  getClaimsByPostId: (postId: string) => Claim[]
}

const AppContext = React.createContext<AppContextValue | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<User[]>(INITIAL_USERS)
  const [posts, setPosts] = React.useState<Post[]>(INITIAL_POSTS)
  const [withdrawals, setWithdrawals] = React.useState<WithdrawalRequest[]>(
    INITIAL_WITHDRAWALS
  )
  const [claims, setClaims] = React.useState<Claim[]>([])
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [rewardEligibilities, setRewardEligibilities] = React.useState<
    Record<string, RewardEligibility[]>
  >({})

  const login = React.useCallback(
    (phoneOrEmail: string, password: string) => {
      const q = phoneOrEmail.trim().toLowerCase()
      const u = users.find(
        (x) =>
          x.phone === phoneOrEmail.trim() ||
          x.email.toLowerCase() === q
      )
      if (!u || (u.password && u.password !== password)) {
        return { ok: false, message: "Утас эсвэл имэйл, нууц үг буруу байна." }
      }
      setCurrentUser(u)
      return { ok: true }
    },
    [users]
  )

  const signup = React.useCallback(
    (payload: {
      sisiId: string
      phone: string
      email: string
      password: string
      facebook?: string
      name: string
    }) => {
      if (users.some((u) => u.sisiId === payload.sisiId.trim())) {
        return { ok: false, message: "Энэ SISI ID аль хэдийн бүртгэлтэй." }
      }
      if (users.some((u) => u.phone === payload.phone.trim())) {
        return { ok: false, message: "Энэ утасны дугаар аль хэдийн бүртгэлтэй." }
      }
      const nu: User = {
        id: `u-${Date.now()}`,
        sisiId: payload.sisiId.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        facebook: payload.facebook?.trim(),
        name: payload.name.trim(),
        password: payload.password,
      }
      setUsers((prev) => [...prev, nu])
      setCurrentUser(nu)
      return { ok: true }
    },
    [users]
  )

  const logout = React.useCallback(() => setCurrentUser(null), [])

  const addPost = React.useCallback(
    (post: Omit<Post, "id" | "status"> & { status?: PostStatus }) => {
      const p: Post = {
        ...post,
        id: `p-${Date.now()}`,
        status: post.status ?? "published",
      }
      setPosts((prev) => [p, ...prev])
      return p
    },
    []
  )

  const updatePostStatus = React.useCallback((id: string, status: PostStatus) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }, [])

  /** Хүсэлт бүүнэ - олсон зар дээр */
  const submitClaim = React.useCallback(
    (payload: { postId: string; answers: string[] }) => {
      const post = posts.find((p) => p.id === payload.postId)
      if (!post || !post.verificationQuestion) {
        return { ok: false, message: "Зар олдсонгүй буюу баталгаажуулалт байхгүй." }
      }
      if (!currentUser) {
        return { ok: false, message: "Эхлээд нэвтэрнэ үү." }
      }
      if (payload.answers.length !== post.verificationQuestion.length) {
        return { ok: false, message: "Бүх асуултанд хариулна уу." }
      }

      const newClaim: Claim = {
        id: `claim-${Date.now()}`,
        postId: payload.postId,
        claimantId: currentUser.id,
        claimantName: currentUser.name,
        claimantEmail: currentUser.email,
        answers: payload.answers,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      setClaims((prev) => [newClaim, ...prev])
      return { ok: true, claimId: newClaim.id }
    },
    [posts, currentUser]
  )

  /** Админ - хүсэлтийг review хийнэ */
  const reviewClaim = React.useCallback(
    (claimId: string, status: ClaimStatus, notes?: string) => {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status,
                reviewedAt: new Date().toISOString(),
                reviewedBy: currentUser?.id,
                notes,
              }
            : c
        )
      )
      
      // If approved, add reward eligibility
      if (status === "approved") {
        const claim = claims.find((c) => c.id === claimId)
        const post = posts.find((p) => p.id === claim?.postId)
        if (claim && post && post.finderRewardAmount && post.finderRewardAmount > 0) {
          setRewardEligibilities((prev) => {
            const uid = claim.claimantId
            const list = prev[uid] ?? []
            if (list.some((e) => e.postId === post.id)) return prev
            return {
              ...prev,
              [uid]: [...list, { postId: post.id, amount: post.finderRewardAmount! }],
            }
          })
        }
      }
    },
    [claims, posts, currentUser]
  )

  const getClaimsByPostId = React.useCallback(
    (postId: string) => claims.filter((c) => c.postId === postId),
    [claims]
  )

  const submitWithdrawal = React.useCallback(
    (payload: {
      postId: string
      amount: number
      bankName: string
      accountNumber: string
    }) => {
      if (!currentUser) return
      const id = `w-${Date.now()}`
      const row: WithdrawalRequest = {
        id,
        userId: currentUser.id,
        postId: payload.postId,
        amount: payload.amount,
        bankName: payload.bankName.trim(),
        accountNumber: payload.accountNumber.trim(),
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setWithdrawals((prev) => [...prev, row])
      setRewardEligibilities((prev) => {
        const list = prev[currentUser.id] ?? []
        return {
          ...prev,
          [currentUser.id]: list.filter((e) => e.postId !== payload.postId),
        }
      })
    },
    [currentUser]
  )

  const completeWithdrawal = React.useCallback((id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "completed" as const } : w))
    )
  }, [])

  const getUserById = React.useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  )

  const value = React.useMemo<AppContextValue>(
    () => ({
      users,
      posts,
      withdrawals,
      claims,
      currentUser,
      rewardEligibilities,
      login,
      signup,
      logout,
      addPost,
      updatePostStatus,
      submitClaim,
      reviewClaim,
      submitWithdrawal,
      completeWithdrawal,
      getUserById,
      getClaimsByPostId,
    }),
    [
      users,
      posts,
      withdrawals,
      claims,
      currentUser,
      rewardEligibilities,
      login,
      signup,
      logout,
      addPost,
      updatePostStatus,
      submitClaim,
      reviewClaim,
      submitWithdrawal,
      completeWithdrawal,
      getUserById,
      getClaimsByPostId,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const ctx = React.useContext(AppContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}