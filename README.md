# 🌾 KrishiMitra AI

**AI-Powered Smart Farmer Assistance, Rural Development & Grievance Management Platform**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Java 17+
- MySQL 8.0+
- Maven 3.9+
- Docker & Docker Compose (for containerized setup)

---

## 📁 Project Structure

```
krishimitra/
├── frontend/                  # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable UI components
│   │   │   └── layouts/       # Page layouts (Farmer/Officer/Admin)
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Register, OTP, Reset
│   │   │   ├── farmer/        # 18 farmer module pages
│   │   │   ├── officer/       # Officer dashboard & complaints
│   │   │   └── admin/         # Admin panel pages
│   │   ├── services/          # Axios API service layer
│   │   ├── store/             # Redux Toolkit slices
│   │   └── App.jsx            # Main router
│   └── Dockerfile
│
├── backend/                   # Spring Boot 3 + Java 17
│   └── src/main/java/com/krishimitra/
│       ├── controller/        # REST API controllers
│       ├── service/           # Business logic layer
│       │   └── impl/          # Service implementations
│       ├── repository/        # Spring Data JPA repos
│       ├── entity/            # JPA entities
│       ├── dto/               # Request/Response DTOs
│       │   ├── request/
│       │   └── response/
│       ├── security/          # JWT filter, UserDetailsService
│       ├── config/            # Spring config beans
│       └── exception/         # Custom exceptions + global handler
│
├── docker-compose.yml         # Full-stack Docker setup
├── .env.example               # Environment variable template
└── README.md
```

---

## 🎯 Modules

| Module | Description |
|--------|-------------|
| 🔐 Authentication | JWT + OTP, Role-based access (Farmer/Officer/Admin) |
| 📊 Farmer Dashboard | Weather, alerts, AI tips, complaint stats |
| 🤖 AI Assistant | Claude-powered chatbot for farming queries |
| 📋 Grievances | Full complaint lifecycle with AI categorization |
| 👥 Community | Voting, trending issues, village board |
| 🌿 Crop Doctor | AI plant disease detection from photos |
| 🌤 Weather | 7-day forecast with farming advisory |
| 📈 Mandi Prices | Live market prices with trend charts |
| 🏛 Schemes | Government scheme discovery & eligibility |
| 🧪 Soil Health | NPK analysis, AI recommendations |
| 💰 Loan Assistant | KCC eligibility, EMI calculator |
| 🛒 Marketplace | Buyer/seller crop listings |
| 🚜 Equipment Rental | Tractor/harvester booking |
| 📅 Farm Calendar | AI-generated crop schedules |
| 🐄 Livestock | Animal records, vaccination tracking |
| 📁 Documents | Encrypted land record vault |
| 📰 News | Hyper-local agriculture news |
| 🆘 Emergency SOS | One-tap SOS with emergency contacts |
| 🔔 Notifications | Real-time alerts across all modules |
| ⚙️ Admin Panel | User mgmt, analytics, officer mgmt |

---

## ⚡ Local Development Setup

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/krishimitra-ai.git
cd krishimitra-ai
cp .env.example .env
# Edit .env with your API keys
```

### 2. Database Setup
```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 3. Backend
```bash
cd backend
mvn spring-boot:run
# API runs at http://localhost:8080/api
# Swagger UI: http://localhost:8080/api/swagger-ui.html
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/swagger-ui.html
- MySQL: localhost:3306

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer@demo.com | Demo@123 |
| Officer | officer@demo.com | Demo@123 |
| Admin | admin@demo.com | Demo@123 |

---

## 🔌 API Overview

### Authentication
```
POST /api/auth/register     — Register new user
POST /api/auth/login        — Login, get JWT
GET  /api/auth/me           — Get current user profile
POST /api/auth/verify-otp   — Verify OTP
POST /api/auth/forgot-password
POST /api/auth/reset-password
PUT  /api/auth/change-password
```

### Complaints
```
POST   /api/complaints              — File complaint (multipart)
GET    /api/complaints/my           — My complaints (paginated)
GET    /api/complaints              — All complaints (Admin/Officer)
GET    /api/complaints/{id}         — Complaint detail
GET    /api/complaints/{id}/timeline
PATCH  /api/complaints/{id}/status  — Update status (Officer/Admin)
PATCH  /api/complaints/{id}/assign  — Assign officer (Admin)
POST   /api/complaints/{id}/vote    — Community upvote
POST   /api/complaints/{id}/feedback
GET    /api/complaints/stats
POST   /api/complaints/check-duplicate
```

### AI Assistant
```
POST /api/ai/chat           — Chat with KrishiMitra AI
GET  /api/ai/suggestions    — Get suggested questions
POST /api/ai/crop-doctor    — Upload image for disease detection
POST /api/ai/soil-analysis  — Upload soil report for analysis
```

### Weather
```
GET /api/weather/current        — Current weather
GET /api/weather/forecast       — 7-day forecast
GET /api/weather/alerts         — Active alerts
GET /api/weather/farming-advice — Farming advice
```

### Mandi Prices
```
GET /api/mandi/prices           — Current prices
GET /api/mandi/nearby           — Nearby mandis
GET /api/mandi/prices/history   — Historical prices
GET /api/mandi/prices/forecast  — AI price forecast
```

### Admin
```
GET   /api/admin/stats
GET   /api/admin/users
PATCH /api/admin/users/{id}/role
PATCH /api/admin/users/{id}/status
GET   /api/admin/officers
POST  /api/admin/officers
GET   /api/admin/analytics/villages
GET   /api/admin/analytics/departments
GET   /api/admin/analytics/resolution
```

---

## 🛡️ Security

- JWT authentication with 24h expiry + 7d refresh tokens
- BCrypt password hashing (strength 12)
- Role-based access control (FARMER / OFFICER / ADMIN / SUPER_ADMIN)
- CORS configured per environment
- Input validation on all endpoints
- Global exception handling with proper HTTP status codes
- SQL injection protection via JPA parameterized queries
- File upload validation (type + size)
- Audit logging for sensitive actions

---

## 🧪 Running Tests

```bash
cd backend
mvn test                    # Unit tests
mvn verify                  # Integration tests
mvn test -Dtest=AuthControllerTest
```

---

## 📦 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes (for AI) | Claude API key for AI assistant |
| `WEATHER_API_KEY` | Optional | OpenWeatherMap API key |
| `JWT_SECRET` | Yes | Long random string for JWT signing |
| `DB_USERNAME` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `MAIL_USERNAME` | Optional | Gmail for OTP/notifications |
| `AWS_ACCESS_KEY` | Optional | S3 file storage (uses local if not set) |

---

## 🏗 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Recharts, React Router v6

**Backend:** Spring Boot 3.2, Spring Security, Spring Data JPA, JWT (JJWT), MySQL 8.0, Maven

**Infrastructure:** Docker, Docker Compose, Nginx, AWS S3

**AI:** Anthropic Claude API (claude-sonnet-4-6), OpenWeatherMap API

---

## 📄 License

Proprietary — KrishiMitra AI © 2024. All rights reserved.

Built with ❤️ for Indian Farmers 🌾
