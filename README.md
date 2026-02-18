# CodeArena - Real-Time Coding Contest Platform

A production-grade full-stack web application for hosting real-time coding contests with automated judging, live leaderboards, and modern UI/UX.

## 🚀 Features

- **JWT Authentication** with refresh tokens and role-based access control (Admin/Participant)
- **Real-Time Updates** via Socket.io for leaderboards and contest status
- **Automated Code Execution** using Judge0 API with support for 7+ languages
- **Contest Management** with automatic state transitions (upcoming → live → ended)
- **Live Leaderboards** with penalty time calculation and real-time ranking
- **Modern UI** with dark-themed glassmorphism design and Framer Motion animations
- **Monaco Editor** integration with custom themes and split-pane layout
- **Secure Backend** with Helmet, CORS, rate limiting, and centralized error handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Judge0 RapidAPI key ([Get it here](https://rapidapi.com/judge0-official/api/judge0-ce))

## 🛠️ Installation

### 1. Clone the repository

```bash
cd D:\DEV\CodePlatform
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/codearena?retryWrites=true&w=majority

# JWT Secrets (generate secure random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Judge0 RapidAPI Configuration
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile

### Contests
- `GET /api/v1/contests` - Get all contests (with filtering)
- `GET /api/v1/contests/:id` - Get contest details
- `POST /api/v1/contests` - Create contest (Admin only)
- `PUT /api/v1/contests/:id` - Update contest (Admin only)
- `DELETE /api/v1/contests/:id` - Delete contest (Admin only)
- `POST /api/v1/contests/:id/join` - Join contest

### Problems
- `GET /api/v1/problems/contest/:contestId` - Get problems by contest
- `GET /api/v1/problems/:id` - Get problem details
- `POST /api/v1/problems` - Create problem (Admin only)
- `PUT /api/v1/problems/:id` - Update problem (Admin only)
- `DELETE /api/v1/problems/:id` - Delete problem (Admin only)

### Submissions
- `POST /api/v1/submissions` - Submit code
- `GET /api/v1/submissions/:id` - Get submission status
- `GET /api/v1/submissions/user/history` - Get user submissions
- `GET /api/v1/submissions/leaderboard/:contestId` - Get contest leaderboard

## 🎨 Tech Stack

### Frontend
- React 18 + Vite
- Redux Toolkit (State Management)
- React Router v6
- Socket.io Client
- Monaco Editor
- Framer Motion
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- Judge0 API Integration
- Helmet (Security)
- CORS
- Express Rate Limit
- Morgan (Logging)
- Node-Cron (Background Jobs)

## 🔐 Default Admin Account

After setting up, register with role "admin" to access admin features:
- Create contests
- Manage problems
- View analytics

## 📖 Usage Guide

### For Participants:
1. Register/Login
2. Browse available contests
3. Join a live contest
4. Solve problems using the code editor
5. Submit solutions and get instant feedback
6. Track your rank on the live leaderboard

### For Admins:
1. Login with admin account
2. Navigate to Admin Dashboard
3. Create new contests with problems
4. Manage contest settings and schedules
5. Monitor participant activity

## 🏗️ Project Structure

```
CodePlatform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Redux slices
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & Socket services
│   │   ├── store/         # Redux store
│   │   └── styles/        # Global styles
│   └── package.json
│
└── server/                # Node.js backend
    ├── src/
    │   ├── config/       # Configuration files
    │   ├── controllers/  # Request handlers
    │   ├── jobs/         # Background jobs
    │   ├── middleware/   # Auth, validation, errors
    │   ├── models/       # Mongoose schemas
    │   ├── routes/       # API routes
    │   ├── services/     # Business logic
    │   └── utils/        # Helper functions
    └── package.json
```

## 🔧 Environment Variables

See `.env.example` files in both `client` and `server` directories for all required environment variables.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for competitive programmers**
