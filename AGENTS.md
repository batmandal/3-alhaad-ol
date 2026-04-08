# Agent Instructions: NUM Lost & Found Next.js App

You are an expert Next.js (App Router), React, and Tailwind CSS developer. Follow these steps strictly when building features. Read `claude.md` for project context and complex business logic.

## Phase 1: Auth & Layout
1. Create the base layout with `Header` and `Footer` (`© 2026 Bagsh Space, Inc. All rights reserved.`).
2. Build Auth Modals (Login / Sign Up).
   - **CRITICAL:** Sign Up form MUST include inputs for `SISI ID` (Student Code) and `Утасны дугаар` (Phone Number).
3. Set up global state for Auth and Modals.

## Phase 2: Home Page & Feed
1. Build Hero section (`< 100vh`) with "Хаясан" (Lost) and "Олсон" (Found) CTA buttons.
2. Build Feed section with Tabs (Lost/Found) and Filters (Search, Location, Category).
3. Ensure UI is fully in Mongolian.

## Phase 3: Create Post & Payment Flow
1. Build the Create Post Modal with conditional fields based on `type`.
2. **Verification Logic Setup:** If `type === 'found'`, include inputs for `verificationQuestion` and `correctAnswer`.
3. **Escrow/Paid Logic Setup:** If `type === 'lost'` (Reward input) OR "FB Share" is checked, the submit action must NOT publish immediately.
4. **Payment Modal:** After form submission, transition to a "Төлбөр төлөх" (Payment) step showing a mock QPay QR code. Add a "Төлбөр шалгах" (Verify Payment) mock button that sets the post status to `Published`.

## Phase 4: Verification & Match UI (Item Details Page)
1. On the Item Details page for a `found` item, show the `verificationQuestion` input.
2. Build the matching logic: If user input matches `correctAnswer` (ignore case/spaces), reveal a hidden `ContactCard` component showing the poster's Phone Number and SISI ID. Do not show contact info before a correct guess.

## Phase 5: Profile & Withdrawal (Payout)
1. Build `/profile` page.
2. Implement the "Escrow Claim" UI: For posts where the user is the validated finder, show a "Шагнал авах" (Withdraw Reward) button.
3. Clicking it opens a Modal to input Bank Name and Account Number to submit a payout request to the system.

## Phase 6: Admin Dashboard
1. Create `/admin` layout.
2. Build tables to manage Users, Posts, and "Мөнгө татах хүсэлт" (Withdrawal Requests) where admins can mark escrow payouts as completed.

## Coding Rules:
- All UI text, placeholders, and alerts MUST be in Mongolian.
- Use Shadcn UI for forms, dialogs, and inputs.
- Keep components modular. Isolate complex logic (like matching answers or payment flows) into custom hooks if necessary.