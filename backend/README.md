# Lost & Found Backend

Express.js + MongoDB (Mongoose) backend for the Lost & Found Next.js app.

## Stack
- Node.js + Express 4
- MongoDB via Mongoose 8
- JWT auth (bcryptjs for password hashing)
- CORS + morgan logging

## Setup

```bash
cd backend
npm install
# make sure MongoDB is running locally on 27017, or update MONGO_URI in .env
npm run seed   # optional: insert demo users, posts, faqs
npm run dev    # or: npm start
```

Server listens on **http://localhost:8080** (configurable via `PORT` in `.env`).

## Env vars (`.env`)
```
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/lost-found
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

## Folder layout
```
backend/
└── src/
    ├── config/db.js
    ├── models/         User, Post, Claim, Withdrawal, Faq, Transaction, SecurityLog
    ├── controllers/    auth, user, post, claim, withdrawal, faq, admin
    ├── routes/         /api/* mappings
    ├── middleware/     auth (JWT), errorHandler
    ├── utils/          jwt, normalize
    ├── seed/seed.js
    └── server.js
```

## API endpoints

### Auth (`/api/auth`)
- `POST /signup` — `{ sisiId, phone, email, password, name, facebook? }` → `{ token, user }`
- `POST /login`  — `{ phoneOrEmail, password }` → `{ token, user }`
- `GET  /me`     — `Authorization: Bearer <token>` → `{ user }`

### Users (`/api/users`)
- `GET  /`      (admin) — list users
- `GET  /:id`   (auth)  — get user
- `PATCH /me`   (auth)  — update profile

### Posts (`/api/posts`)
- `GET  /`         — query: `type, status, category, location, search, mine`
- `GET  /:id`
- `POST /`         (auth) — create post (default `pending_payment`)
- `PATCH /:id/status` (auth) — change post status
- `DELETE /:id`    (auth) — owner or admin
- `POST /:id/verify` — `{ answer }` → `{ ok }`

### Claims (`/api/claims`)
- `POST /`         (auth) — `{ postId, answers: [...] }`
- `GET  /me`       (auth)
- `GET  /post/:postId` (auth) — owner/admin
- `PATCH /:id/approve` (auth) — owner/admin
- `PATCH /:id/reject`  (auth) — owner/admin

### Withdrawals (`/api/withdrawals`)
- `POST /`         (auth) — `{ postId, amount, bankName, accountNumber }`
- `GET  /me`       (auth)
- `GET  /`         (admin)
- `PATCH /:id/complete` (admin)

### FAQ (`/api/faq`)
- `GET  /` — `?category=general|lost|found|reward|all`
- `GET  /:id`
- `POST /`, `PATCH /:id`, `DELETE /:id` (admin)

### Admin (`/api/admin`)
- `GET /stats`
- `GET /transactions`
- `GET /security-logs`

## Health check
```
GET /health → { ok: true }
```
