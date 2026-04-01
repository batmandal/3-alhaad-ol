export type PostType = "lost" | "found"
export type PostStatus = "draft" | "pending_payment" | "published"

export interface VerificationQuestion {
  question: string
  answer: string
}

export interface Post {
  id: string
  type: PostType
  title: string
  description: string
  category: string
  location: string
  date: string
  imageUrl: string
  authorId: string
  status: PostStatus
  rewardAmount?: number
  fbShare?: boolean
  /** "found" зарын хуучин нэг асуулт */
  verificationQuestion?: string
  correctAnswer?: string
  /** 1-3 асуулт (lost болон found) */
  verificationQuestions?: VerificationQuestion[]
  finderRewardAmount?: number
  escrow?: boolean
  escrowPaid?: boolean
}

export interface User {
  id: string
  sisiId: string
  phone: string
  email: string
  facebook?: string
  name: string
  password?: string
  isAdmin?: boolean
}

export type ClaimStatus = "pending" | "approved" | "rejected"

export interface Claim {
  id: string
  postId: string
  postTitle: string
  postType: PostType
  claimantId: string
  claimantName: string
  claimantEmail: string
  claimantPhone: string
  answers: string[]
  answersCorrect: boolean[]
  status: ClaimStatus
  createdAt: string
}

export type WithdrawalStatus = "pending" | "completed"

export interface WithdrawalRequest {
  id: string
  userId: string
  postId: string
  amount: number
  bankName: string
  accountNumber: string
  status: WithdrawalStatus
  createdAt: string
}

export interface RewardEligibility {
  postId: string
  amount: number
}
