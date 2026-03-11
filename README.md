# 🚗 Picabo — Ride-Hailing Platform for Abidjan

Picabo is a full-featured ride-hailing platform built for Abidjan, Côte d'Ivoire. It introduces a **driver-passenger auction system** where drivers bid on trip requests, giving passengers choice and competitive pricing.

---

## ✨ Features

- 📱 **OTP Authentication** — Phone-number-based login via SMS (Twilio)
- 🏷️ **Bidding / Auction System** — Drivers bid on passenger trip requests in real time
- 🗺️ **Real-Time GPS Tracking** — Live map tracking during trips via WebSocket
- 💰 **Mobile Money Payments** — CinetPay integration (Orange Money, MTN, Wave)
- 🔔 **Push Notifications** — Firebase Cloud Messaging for ride updates
- 📊 **Driver Earnings Dashboard** — Daily/weekly earnings & trip history
- 🛡️ **Admin Panel** — Full operations management dashboard

---

## 🏗️ Tech Stack

| Layer          | Technology                                     |
|----------------|------------------------------------------------|
| Passenger App  | Flutter 3.x (Dart) — BLoC, go_router          |
| Driver App     | Flutter 3.x (Dart) — BLoC, go_router          |
| Backend API    | Node.js + NestJS + TypeScript                  |
| Admin Panel    | Next.js 14 + TypeScript                        |
| Database       | PostgreSQL 15 + PostGIS (geospatial queries)   |
| Cache / Queue  | Redis 7                                        |
| Real-Time      | Socket.IO (WebSocket)                          |
| Maps           | Google Maps Platform                           |
| SMS            | Twilio                                         |
| Payments       | CinetPay                                       |
| Storage        | AWS S3 (or compatible)                         |
| Notifications  | Firebase Cloud Messaging (FCM)                 |
| Containerized  | Docker + Docker Compose                        |

---

## 🗺️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│  ┌──────────────────┐      ┌──────────────────┐          │
│  │  Passenger App   │      │   Driver App      │          │
│  │  (Flutter/BLoC)  │      │  (Flutter/BLoC)   │          │
│  └────────┬─────────┘      └────────┬──────────┘          │
│           │                         │                      │
│  ┌────────▼─────────────────────────▼──────────┐          │
│  │           Admin Panel (Next.js)              │          │
│  └────────────────────┬────────────────────────┘          │
└───────────────────────┼─────────────────────────────────-─┘
                        │ REST / WebSocket
┌───────────────────────▼────────────────────────────────────┐
│                    BACKEND (NestJS)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │   Auth   │  │  Trips   │  │ Auction  │  │  Payments │  │
│  │  Module  │  │  Module  │  │  Module  │  │   Module  │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Drivers  │  │  Users   │  │Websocket │                  │
│  │  Module  │  │  Module  │  │ Gateway  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└───────┬──────────────────────────────┬────────────────────-┘
        │                              │
┌───────▼──────────┐        ┌──────────▼──────────┐
│  PostgreSQL 15   │        │      Redis 7         │
│  + PostGIS       │        │  (Cache + Pub/Sub)   │
└──────────────────┘        └─────────────────────-┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose v2
- [Flutter SDK](https://flutter.dev/docs/get-started/install) ≥ 3.10.0
- [Node.js](https://nodejs.org/) ≥ 18 LTS
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/picabo.git
cd picabo
```

### 2. Environment setup

```bash
cp .env.example .env
# Edit .env with your actual credentials
nano .env
```

### 3. Running with Docker

```bash
# Start all services
npm run docker:up

# View logs
docker-compose logs -f

# Stop all services
npm run docker:down
```

### 4. Running locally (development)

```bash
# Install Node.js dependencies
npm install

# Start backend in watch mode
npm run dev:backend

# Start admin panel
npm run dev:admin
```

### 5. Flutter apps

```bash
# Passenger App
cd apps/passenger-app
flutter pub get
flutter run

# Driver App
cd apps/driver-app
flutter pub get
flutter run
```

---

## 📱 Mobile Apps

| App            | Directory                | Target Platform |
|----------------|--------------------------|-----------------|
| Passenger App  | `apps/passenger-app/`    | Android & iOS   |
| Driver App     | `apps/driver-app/`       | Android & iOS   |

Both apps use:
- **BLoC** for state management
- **go_router** for declarative navigation
- **Dio** for HTTP requests
- **Socket.IO** for real-time communication
- **Google Maps Flutter** for maps & tracking

---

## 📖 API Documentation

Once the backend is running, visit:

- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`

---

## 🌍 Localization

The app supports:
- 🇫🇷 French (Côte d'Ivoire) — default
- 🇺🇸 English (US)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
