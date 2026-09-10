# RecallFlow Backend API 🧠⚡

RecallFlow is an automated study revision management platform powered by **Spaced Repetition algorithms**. This repository contains the backend RESTful API built with **Node.js**, **Express 5**, **Sequelize ORM**, and **MySQL 8**.

---

## 🚀 Features

- **Spaced Repetition Scheduler**: Automated revision calculation based on proven retention curves (`quick`, `three_month`, `six_month`, `one_year`, `two_year`, `custom`).
- **Course & Topic Hierarchy**: Manage study courses, syllabi, topic dependencies, and study goals.
- **Study Session Logging**: Track study duration, difficulty ratings (`easy`, `medium`, `hard`), and session notes.
- **Revision Manager**: Filter due today, upcoming, and overdue/missed revisions with completion notes.
- **Daily Dashboard**: Real-time aggregation of study minutes, due reviews, and daily consistency.
- **Analytics & Learning Streaks**: Track consecutive study days, completion rates %, 7-day and 30-day activity histories.
- **Monthly Calendar Grid**: Day-by-day activity visualization of study entries and revision statuses.
- **Global Search**: Search across courses, topics, study notes, and revision notes.
- **Notifications Engine**: In-app alerts for pending reviews, overdue items, and daily study reminders.
- **Authentication & JWT Security**: Secure registration and login with `bcryptjs` password hashing and Bearer JWT tokens.
- **AI Active Recall Tools**: Generate flashcard Q&A pairs, self-test quizzes, and topic summaries.
- **Backup & Restore**: Full JSON snapshot export and restore.
- **Production Hardened**: HTTP security headers (`helmet`), CORS protection, rate limiting, request logging, and graceful shutdown handling.
- **Interactive Documentation**: Live Swagger / OpenAPI 3.0 UI at `/api-docs`.

---

## 🛠️ Prerequisites

Before running the backend locally, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18+ or 20+ LTS recommended)
- [npm](https://www.npmjs.com/) (version 9+)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (version 8.0+) **OR** [Docker Desktop](https://www.docker.com/)

---

## 📦 Local Setup & Installation

### 1. Clone or Open the Repository
```bash
cd "C:\Users\Prakash\Personal Projects\recallflow-backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup the MySQL Database
Ensure your MySQL service is running. Open your MySQL client (MySQL Workbench, TablePlus, or CLI) and create the database:
```sql
CREATE DATABASE recallflow;
```

### 4. Configure Environment Variables
Copy the example environment configuration file to create your `.env`:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and configure your database credentials and secret keys:
```env
PORT=3000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=recallflow

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🏃 Running the Application

### Development Mode (with automatic restart via nodemon):
```bash
npm run dev
```
The server will start at:
- **API Base URL**: `http://localhost:3000/api/v1`
- **Swagger Documentation**: `http://localhost:3000/api-docs`

> **Note**: Database tables and associations will be automatically synchronized via Sequelize (`sequelize.sync()`) upon server startup.

### Production Mode:
```bash
npm start
```

---

## 🐳 Running with Docker (Alternative)

If you have Docker Desktop installed, you can spin up both the MySQL database and the backend service with a single command:

```bash
docker compose up --build -d
```

- API will be accessible at `http://localhost:3000`
- MySQL container will be exposed at `localhost:3306`

To stop the containers:
```bash
docker compose down
```

---

## 🧪 Running Tests

The test suite contains **24 test suites** and **138 unit & integration tests** with 100% pass rate.

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage report
npm run test:coverage
```

---

## 📖 API Documentation

Once the server is running, explore and test all API endpoints interactively:

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Alternate Route**: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

Full Markdown API specs are also available in [`docs/api.md`](docs/api.md).

---

## 🌐 Connecting the Frontend

To run the complete full-stack application:

1. Keep this backend running on port `3000`.
2. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd "C:\Users\Prakash\Personal Projects\recallflow-frontend"
   npm install
   npm run dev
   ```
3. Open the frontend web app at **`http://localhost:3001`** (or `http://localhost:3000`).

---

## 📁 Project Structure

```
recallflow-backend/
├── docs/                       # Project specifications, schema & roadmap
│   ├── api.md                  # Comprehensive API documentation
│   ├── architecture.md         # System architecture & interval algorithms
│   ├── changelog.md            # Release log
│   ├── database.md             # MySQL schema specifications
│   ├── development-plan.md     # Master development plan
│   └── roadmap.md              # Progress & phase status matrix
├── src/
│   ├── config/                 # DB connection & Swagger setup
│   ├── constants/              # HTTP status codes & constants
│   ├── controllers/            # Route controllers
│   ├── middlewares/            # Auth, validation, rate limiting, error handling
│   ├── models/                 # Sequelize models & associations
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business logic layer
│   ├── utils/                  # Spaced repetition scheduler & ApiError
│   ├── validators/             # Joi input validation schemas
│   ├── app.js                  # Express app initialization
│   └── server.js               # HTTP server entrypoint & graceful shutdown
├── tests/                      # Jest & Supertest suites
│   ├── integration/            # HTTP controller integration tests
│   └── unit/                   # Service layer unit tests
├── .env.example                # Environment configuration template
├── docker-compose.yml          # Multi-container Docker configuration
├── Dockerfile                  # Production container definition
└── package.json                # Project dependencies and npm scripts
```
