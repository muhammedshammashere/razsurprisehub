# Raz Surprise Hub

Production-ready MERN gift box e-commerce platform with JWT auth, gift box builder, Razorpay payments, and admin dashboard.

## Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore (via custom Mongoose-compatibility wrapper)
- **Auth:** JWT
- **Payments:** Razorpay

## Project structure

```
surprise-venture/
├── client/          # React frontend
├── server/          # Express API
└── documentation/   # API & setup guides
```

## Quick start

See [documentation/INSTALLATION.md](documentation/INSTALLATION.md) for full setup.

### 1. Firebase Setup

Create a Firebase project, download a service account JSON, and place it in the `server` directory as `service-account.json`.

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env with JWT_SECRET, Razorpay keys, and FIREBASE_SERVICE_ACCOUNT (optional)
npm install
npm run seed
npm run dev
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:5000/api

### Default credentials (after seed)

- **Admin:** `admin@razsurprisehub.com` / `adminraz@2026`
- **Guest Customer:** `customer@surpriseventure.com` / `customer123456`

## Features

- User registration & login with JWT
- Product categories & CRUD (admin)
- Gift box builder with real-time pricing
- Personalized message & delivery date
- Razorpay checkout & payment verification
- Order tracking & history
- Admin dashboard (products, orders, users, stats)
- Dark/light theme, responsive UI

## License

MIT
