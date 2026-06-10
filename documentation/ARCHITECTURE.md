# Architecture — Raz Surprise Hub

## Overview

```
[React Client]  --JWT/API-->  [Express API]  --Mongoose-->  [MongoDB Atlas]
                                    |
                              [Razorpay API]
```

## Backend layers

| Layer | Responsibility |
|-------|----------------|
| Routes | HTTP mapping, middleware chain |
| Controllers | Business logic, validation |
| Models | Mongoose schemas & hooks |
| Middleware | Auth, admin, errors, uploads |
| Config | DB, Razorpay singleton |

## Data models

- **User** — auth, role, address
- **Product** — catalog, categories, stock
- **GiftBox** — draft builder state per user
- **Order** — checkout snapshot, payment, status

## Auth flow

1. Register/login → JWT signed with `JWT_SECRET`
2. Client stores token in `localStorage` (`sv_token`)
3. Axios interceptor attaches `Authorization: Bearer`
4. `protect` middleware decodes JWT → `req.user`
5. `adminOnly` checks `role === 'admin'`

## Order & payment flow

1. User builds **GiftBox** (draft)
2. **POST /orders** creates Order (`pending`) from box
3. **POST /payments/create-order** creates Razorpay order
4. Client opens Razorpay Checkout
5. **POST /payments/verify** validates signature
6. Stock decremented, gift box marked `converted`, new draft created

## Frontend structure

- **Contexts:** Auth, Theme, GiftBox
- **ProtectedRoute:** user routes
- **AdminRoute:** `adminOnly` via ProtectedRoute prop
- **Vite proxy:** `/api` → backend in development

## Security notes

- Never expose `RAZORPAY_KEY_SECRET` to client
- Use strong `JWT_SECRET` in production
- Restrict MongoDB network access in production
- Validate delivery dates server-side
