# RecallFlow Changelog

## [1.0.0] - 2026-08-11

### Completed Features & Modules
- **Phase 0 & 1: Project Planning & Database Foundation**
  - Configured Node.js + Express.js backend stack.
  - Defined Sequelize models (`User`, `Course`, `Topic`, `StudyEntry`, `Revision`) and associations.
- **Phase 2.1: Course Module**
  - Implemented CRUD endpoints: `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`.
  - Added Joi validator schemas and custom `ApiError` middleware.
  - Unit tests (16/16 passing) & Integration tests (9/9 passing).
- **Phase 2.2: Topic Module**
  - Implemented CRUD endpoints for topics (`POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`).
  - Added course existence check & unique topic title constraint.
  - Unit tests (14/14 passing) & Integration tests (10/10 passing).
- **Phase 2.3: Study Entry Module**
  - Implemented CRUD endpoints for study entries.
  - Recorded study duration, difficulty rating, study date, and notes.
  - Unit tests (9/9 passing) & Integration tests (9/9 passing).
- **Phase 2.4: Revision Scheduler**
  - Implemented Spaced Repetition calculation engine in `src/utils/scheduler.js`.
  - Automatically generates revision schedules (`quick`, `three_month`, `six_month`, `one_year`, `two_year`, `custom`) upon study entry creation.
  - Scheduler unit tests (3/3 passing).
- **Phase 3: Daily Dashboard**
  - Implemented `GET /api/v1/dashboard/today`.
  - Returns aggregate counts for today's study sessions, today's revisions, total study minutes, pending, missed, and upcoming revisions.
  - Unit tests (2/2 passing) & Integration tests (2/2 passing).
- **Phase 4: Revision Management APIs**
  - Implemented `GET /revisions/today`, `/revisions/upcoming`, `/revisions/missed`, `GET /:id`, `PATCH /:id/complete`.
  - Supports marking revisions completed with custom completion notes and timestamp.
  - Unit tests (6/6 passing) & Integration tests (7/7 passing).
- **Phase 5: Analytics Module**
  - Implemented `GET /api/v1/analytics/overview`, `/weekly`, `/monthly`.
  - Added learning streak calculation engine, revision completion rates, missed revision rates, and 7-day / 30-day activity breakdowns.
  - Unit tests (4/4 passing) & Integration tests (4/4 passing).
- **Phase 6: Calendar Module**
  - Implemented `GET /api/v1/calendar` for monthly calendar grid view.
  - Aggregates study entries, study duration, completed revisions, and missed revisions by day.
  - Unit tests (2/2 passing) & Integration tests (2/2 passing).
- **Phase 7: Search Module**
  - Implemented `GET /api/v1/search?q=...` for global keyword search across Courses, Topics, Study Entries, and Revisions.
  - Unit tests (2/2 passing) & Integration tests (2/2 passing).
- **Phase 8: Notifications Infrastructure**
  - Implemented `GET /api/v1/notifications` for generating daily revision reminders, overdue warnings, and study streak alerts.
  - Unit tests (2/2 passing) & Integration tests (2/2 passing).
- **Phase 9: Authentication & JWT Security**
  - Implemented `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, and `GET /api/v1/auth/me`.
  - Added password hashing (`bcryptjs`), JWT token signing (`jsonwebtoken`), and Bearer authentication middleware (`authenticate`).
  - Unit tests (7/7 passing) & Integration tests (6/6 passing).
- **Phase 10: Security & Production Readiness**
  - Integrated `helmet` for HTTP security headers and `cors` for cross-origin access.
  - Integrated `express-rate-limit` for rate limiting (100 reqs / 15 mins).
  - Implemented request logging middleware and graceful server shutdown (`SIGINT`/`SIGTERM`) with clean database connection pool termination.
- **Phase 11: Interactive API Documentation (Swagger / OpenAPI)**
  - Configured Swagger OpenAPI specs and served interactive UI at `/api-docs` and `/api/v1/docs`.
  - Added Swagger UI integration test (1/1 passing).
- **Phase 12: Frontend Web Application (`recallflow-frontend`)**
  - Initialized decoupled Next.js 16 + React + Tailwind CSS web application repository at `recallflow-frontend`.
  - Built interactive views for Dashboard, Course & Topic Manager, Study Session Logger, Revision Manager, Analytics & Streaks, Monthly Calendar Grid, Global Search, Notifications Drawer, and JWT Auth.
  - Production build compiled successfully (`npm run build` passed in 3.9s).
- **Phase 13: PWA & Mobile Experience**
  - Configured Web App Manifest (`manifest.json`) and Service Worker (`sw.js`) for standalone desktop/mobile installation & offline asset caching.
  - Added `PWAInstaller` component with network offline alert banner and install prompt.
  - Added `MobileNav` touch-friendly bottom navigation bar for mobile devices.
- **Phase 14: Advanced Features**
  - Added `aiService` and AI endpoints (`POST /api/v1/ai/flashcards`, `/quiz`, `/summary`).
  - Added `dataService` and Data Backup/Restore endpoints (`GET /api/v1/data/export`, `POST /api/v1/data/import`).
  - Added unit test suites (2/2 passing) and integration test suites (2/2 passing).





