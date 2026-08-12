# RecallFlow — Backend Development Plan

**Project**: RecallFlow  
**Version**: 1.0  
**Current Goal**: Personal-use study revision platform using Spaced Repetition  
**Backend Stack**: Node.js + Express.js  
**Database**: MySQL  
**ORM**: Sequelize  
**Testing**: Jest + Supertest  
**API Documentation**: Swagger / OpenAPI UI  

---

## Phase 0 — Project Planning & Architecture
**Status**: ✅ COMPLETED

### Objectives
Define initial product scope, architecture, database structure, and technology stack.

### Completed Checklist
- [x] Defined RecallFlow's core problem and solution.
- [x] Defined initial target use case: personal study/revision management.
- [x] Decided to build the first version for a single user, with scalable multi-user authentication support.
- [x] Selected backend stack: Node.js, Express.js, Sequelize, MySQL.
- [x] Defined application modules: Courses, Topics, Study Entries, Revisions, Dashboard, Analytics, Calendar, Search, Notifications, Auth.
- [x] Defined Spaced Repetition algorithms (`quick`, `three_month`, `six_month`, `one_year`, `two_year`, `custom`).
- [x] Defined initial database entities and relations.
- [x] Adopted API-first backend development approach.
- [x] Configured Jest for unit testing and Supertest for HTTP integration testing.

---

## Phase 1 — Database & Backend Foundation
**Status**: ✅ COMPLETED

### 1.1 Database Setup
- [x] Installed and configured MySQL database `recallflow`.

### 1.2 Database Tables
Created models and table schemas:
- [x] `users`: `id`, `name`, `email`, `password`, `created_at`, `updated_at`.
- [x] `courses`: `id`, `user_id`, `title`, `category`, `goal`, `duration_days`, `algorithm`, `start_date`, `status`, `created_at`, `updated_at`.
  - Added unique constraint: `UNIQUE(user_id, title)`.
- [x] `topics`: `id`, `course_id`, `title`, `description`, `created_at`, `updated_at`.
  - Added unique constraint: `UNIQUE(course_id, title)`.
- [x] `study_entries`: `id`, `topic_id`, `study_date`, `duration_minutes`, `difficulty`, `study_notes`, `created_at`, `updated_at`.
- [x] `revisions`: `id`, `study_entry_id`, `revision_number`, `revision_date`, `algorithm`, `status`, `completed_at`, `revision_notes`, `created_at`, `updated_at`.
  - Added unique constraint: `UNIQUE(study_entry_id, revision_number)`.

### 1.3 Sequelize Associations
- [x] `User.hasMany(Course)` / `Course.belongsTo(User)`
- [x] `Course.hasMany(Topic)` / `Topic.belongsTo(Course)`
- [x] `Topic.hasMany(StudyEntry)` / `StudyEntry.belongsTo(Topic)`
- [x] `StudyEntry.hasMany(Revision)` / `Revision.belongsTo(StudyEntry)`

---

## Phase 2 — API Development

### Phase 2.1 — Course Module
**Status**: ✅ COMPLETED
- [x] `POST /api/v1/courses` (Create course)
- [x] `GET /api/v1/courses` (Get all courses for user)
- [x] `GET /api/v1/courses/:courseId` (Get course by ID)
- [x] `PUT /api/v1/courses/:courseId` (Update course)
- [x] `DELETE /api/v1/courses/:courseId` (Delete course)

### Phase 2.2 — Topic Module
**Status**: ✅ COMPLETED
- [x] `POST /api/v1/topics` (Create topic)
- [x] `GET /api/v1/topics` (Get all topics for course)
- [x] `GET /api/v1/topics/:topicId` (Get topic by ID)
- [x] `PUT /api/v1/topics/:topicId` (Update topic)
- [x] `DELETE /api/v1/topics/:topicId` (Delete topic)

### Phase 2.3 — Study Entry Module
**Status**: ✅ COMPLETED
- [x] `POST /api/v1/study-entries` (Record study session & trigger revision scheduler)
- [x] `GET /api/v1/study-entries` (Get all study entries for topic)
- [x] `GET /api/v1/study-entries/:studyEntryId` (Get study entry by ID)
- [x] `PUT /api/v1/study-entries/:studyEntryId` (Update study entry)
- [x] `DELETE /api/v1/study-entries/:studyEntryId` (Delete study entry)

### Phase 2.4 — Revision Scheduler
**Status**: ✅ COMPLETED
- [x] Spaced Repetition calculation engine in `src/utils/scheduler.js`.
- [x] Automatic generation of revision records upon `StudyEntry` creation.
- [x] Algorithm support: `quick`, `three_month`, `six_month`, `one_year`, `two_year`, `custom`.

### Phase 2.5 & 2.6 — Jest + Supertest Testing
**Status**: ✅ COMPLETED
- [x] Unit test suites for all service modules (22 test suites, 131 tests passing).
- [x] Supertest integration test suites for all HTTP endpoints.

---

## Phase 3 — Daily Dashboard
**Status**: ✅ COMPLETED
- [x] `GET /api/v1/dashboard/today`
- [x] Aggregates today's study sessions, today's revisions, total daily study minutes, pending, missed, and upcoming revision counts.

---

## Phase 4 — Revision Management APIs
**Status**: ✅ COMPLETED
- [x] `GET /api/v1/revisions/today`
- [x] `GET /api/v1/revisions/upcoming`
- [x] `GET /api/v1/revisions/missed`
- [x] `GET /api/v1/revisions/:revisionId`
- [x] `PATCH /api/v1/revisions/:revisionId/complete`

---

## Phase 5 — Analytics
**Status**: ✅ COMPLETED
- [x] `GET /api/v1/analytics/overview` (Total hours, completion rates, learning streak)
- [x] `GET /api/v1/analytics/weekly` (7-day study/revision breakdown)
- [x] `GET /api/v1/analytics/monthly` (30-day breakdown)

---

## Phase 6 — Calendar
**Status**: ✅ COMPLETED
- [x] `GET /api/v1/calendar?user_id=1&year=2026&month=8` (Monthly grid view of study sessions and revisions)

---

## Phase 7 — Search
**Status**: ✅ COMPLETED
- [x] `GET /api/v1/search?q=...` (Global keyword search across Courses, Topics, Study Entries, and Revisions)

---

## Phase 8 — Notifications Infrastructure
**Status**: ✅ COMPLETED
- [x] `GET /api/v1/notifications?user_id=1` (Due today revisions, overdue alerts, and daily study reminders)

---

## Phase 9 — Authentication & JWT Security
**Status**: ✅ COMPLETED
- [x] `POST /api/v1/auth/register` (User registration & password hashing with bcrypt)
- [x] `POST /api/v1/auth/login` (User authentication & JWT token generation)
- [x] `GET /api/v1/auth/me` (Protected profile endpoint with Bearer token authentication middleware)

---

## Phase 10 — Backend Security & Production Readiness
**Status**: ✅ COMPLETED
- [x] Helmet security headers (`helmet`).
- [x] CORS middleware (`cors`).
- [x] API rate limiting (`express-rate-limit`).
- [x] Request duration logging.
- [x] Graceful shutdown handling (`SIGINT`/`SIGTERM`) and clean database pool termination.

---

## Phase 11 — Interactive API Documentation (Swagger / OpenAPI)
**Status**: ✅ COMPLETED
- [x] Swagger OpenAPI 3.0 specification (`src/config/swagger.js`).
- [x] Interactive UI mounted at `http://localhost:3000/api-docs` and `/api/v1/docs`.

---

## Next Master Phases

### Phase 12 — Frontend Web Application (Next.js / React)
- **Status**: ⏳ PENDING
- Pages: Dashboard, Courses, Topic Details, Study Logger, Revision Manager, Analytics Charts, Calendar Grid, Global Search, Notifications Panel, Auth Screens.

### Phase 13 — PWA / Mobile Experience
- **Status**: ✅ COMPLETED
- Web App Manifest (`public/manifest.json`) for standalone PWA installation.
- Service Worker (`public/sw.js`) for offline caching & network fallback.
- `PWAInstaller` component for SW registration, offline banner, and PWA install prompt button.
- Mobile bottom navigation bar (`MobileNav.jsx`) for touchscreen navigation.

### Phase 14 — Advanced Features
- **Status**: ✅ COMPLETED
- AI Flashcard Generator (`POST /api/v1/ai/flashcards`).
- AI Self-Test Quiz Generator (`POST /api/v1/ai/quiz`).
- AI Topic Summarizer (`POST /api/v1/ai/summary`).
- Full Data Export & JSON Backup Download (`GET /api/v1/data/export`).
- JSON Backup Import & Restore (`POST /api/v1/data/import`).
