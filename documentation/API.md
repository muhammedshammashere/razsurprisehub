# API Documentation — Raz Surprise Hub

Base URL: `http://localhost:5000/api`

All protected routes require header:

```
Authorization: Bearer <jwt_token>
```

---

## Health

### GET `/health`

```json
{ "success": true, "message": "Raz Surprise Hub API is running" }
```

---

## Auth

### POST `/auth/register`

```json
{ "name": "Jane", "email": "jane@example.com", "password": "secret123", "phone": "9876543210" }
```

**201** — `{ success, token, user }`

### POST `/auth/login`

```json
{ "email": "jane@example.com", "password": "secret123" }
```

### GET `/auth/me` (protected)

Returns current user.

### PUT `/auth/profile` (protected)

```json
{ "name": "Jane", "phone": "...", "address": { "street", "city", "state", "pincode" } }
```

---

## Products

### GET `/products/categories`

Returns category list.

### GET `/products`

Query: `category`, `search`, `page`, `limit`

### GET `/products/:id`

### POST `/products` (admin)

```json
{
  "name": "Rose Box",
  "description": "...",
  "category": "Flowers",
  "price": 999,
  "stock": 10,
  "images": [{ "url": "https://..." }]
}
```

### PUT `/products/:id` (admin)

### DELETE `/products/:id` (admin) — soft delete

### POST `/products/:id/image` (admin) — multipart `image`

---

## Gift Box (protected)

### GET `/gift-box`

Returns draft gift box with populated products and totals.

### POST `/gift-box/items`

```json
{ "productId": "...", "quantity": 2 }
```

### PATCH `/gift-box/items/:productId`

```json
{ "quantity": 3 }
```

### DELETE `/gift-box/items/:productId`

### PATCH `/gift-box`

```json
{ "personalizedMessage": "Happy Birthday!", "deliveryDate": "2026-06-10" }
```

### DELETE `/gift-box` — clear draft

---

## Orders (protected)

### POST `/orders`

```json
{ "shippingAddress": { "street", "city", "state", "pincode" } }
```

Creates order from draft gift box. Status: `pending`.

### GET `/orders`

User order history.

### GET `/orders/:id`

Order detail + tracking.

---

## Payments (protected)

### POST `/payments/create-order`

```json
{ "orderId": "..." }
```

Returns Razorpay order id, amount, keyId.

### POST `/payments/verify`

```json
{
  "orderId": "...",
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```

Verifies HMAC signature and marks order `paid`.

---

## Admin (protected, admin role)

### GET `/admin/stats`

Dashboard metrics + recent orders.

### GET `/admin/orders`

Query: `status`, `page`, `limit`

### PATCH `/admin/orders/:id/status`

```json
{ "status": "shipped" }
```

Valid: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`

### GET `/admin/users`

### PATCH `/admin/users/:id/role`

```json
{ "role": "admin" }
```

### GET `/admin/products`

All products including inactive.

---

## Error format

```json
{ "success": false, "message": "Error description" }
```
