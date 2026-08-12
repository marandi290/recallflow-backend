# RecallFlow Backend API Documentation

Base URL: `/api/v1`

---

## 0. Authentication Endpoints (`/api/v1/auth`)

### User Registration
- **Method**: `POST /api/v1/auth/register`
- **Body**:
  ```json
  {
    "name": "Prakash",
    "email": "prakash@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `201 Created` (returns user object & JWT token)

### User Login
- **Method**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "prakash@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK` (returns user object & JWT token)

### Get Current User Profile
- **Method**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `200 OK`

---

## 1. Course Endpoints (`/api/v1/courses`)

### Create Course
- **Method**: `POST /api/v1/courses`
- **Body**:
  ```json
  {
    "user_id": 1,
    "title": "Node.js & Express Mastery",
    "category": "Backend Development",
    "goal": "Build production ready APIs",
    "duration_days": 90,
    "algorithm": "three_month",
    "start_date": "2026-08-11"
  }
  ```
- **Response**: `201 Created`

### Get All Courses for User
- **Method**: `GET /api/v1/courses?user_id=1`
- **Response**: `200 OK`

### Get Course by ID
- **Method**: `GET /api/v1/courses/:courseId`
- **Response**: `200 OK`

### Update Course
- **Method**: `PUT /api/v1/courses/:courseId`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "status": "completed"
  }
  ```
- **Response**: `200 OK`

### Delete Course
- **Method**: `DELETE /api/v1/courses/:courseId`
- **Response**: `200 OK`

---

## 2. Topic Endpoints (`/api/v1/topics`)

### Create Topic
- **Method**: `POST /api/v1/topics`
- **Body**:
  ```json
  {
    "course_id": 1,
    "title": "Express Middleware Mechanics",
    "description": "Understanding req, res, next, and error middleware"
  }
  ```
- **Response**: `201 Created`

### Get All Topics for Course
- **Method**: `GET /api/v1/topics?course_id=1`
- **Response**: `200 OK`

### Get Topic by ID
- **Method**: `GET /api/v1/topics/:topicId`
- **Response**: `200 OK`

### Update Topic
- **Method**: `PUT /api/v1/topics/:topicId`
- **Body**:
  ```json
  {
    "title": "Updated Topic Title",
    "description": "Updated notes"
  }
  ```
- **Response**: `200 OK`

### Delete Topic
- **Method**: `DELETE /api/v1/topics/:topicId`
- **Response**: `200 OK`

---

## 3. Study Entry Endpoints (`/api/v1/study-entries`)

### Create Study Entry (Triggers Revision Scheduler)
- **Method**: `POST /api/v1/study-entries`
- **Body**:
  ```json
  {
    "topic_id": 1,
    "study_date": "2026-08-11",
    "duration_minutes": 45,
    "difficulty": "medium",
    "study_notes": "Completed session on route handlers"
  }
  ```
- **Response**: `201 Created` (includes automatically generated `revisions` schedule)

### Get All Study Entries for Topic
- **Method**: `GET /api/v1/study-entries?topic_id=1`
- **Response**: `200 OK`

### Get Study Entry by ID
- **Method**: `GET /api/v1/study-entries/:studyEntryId`
- **Response**: `200 OK`

### Update Study Entry
- **Method**: `PUT /api/v1/study-entries/:studyEntryId`
- **Response**: `200 OK`

### Delete Study Entry
- **Method**: `DELETE /api/v1/study-entries/:studyEntryId`
- **Response**: `200 OK`

---

## 4. Revision Management Endpoints (`/api/v1/revisions`)

### Get Today's Revisions
- **Method**: `GET /api/v1/revisions/today?user_id=1`
- **Response**: `200 OK`

### Get Upcoming Revisions
- **Method**: `GET /api/v1/revisions/upcoming?user_id=1`
- **Response**: `200 OK`

### Get Missed Revisions
- **Method**: `GET /api/v1/revisions/missed?user_id=1`
- **Response**: `200 OK`

### Get Revision by ID
- **Method**: `GET /api/v1/revisions/:revisionId`
- **Response**: `200 OK`

### Complete Revision
- **Method**: `PATCH /api/v1/revisions/:revisionId/complete`
- **Body**:
  ```json
  {
    "revision_notes": "Reviewed flashcards successfully"
  }
  ```
- **Response**: `200 OK`

---

## 5. Daily Dashboard Endpoints (`/api/v1/dashboard`)

### Get Today's Dashboard Metrics
- **Method**: `GET /api/v1/dashboard/today?user_id=1`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Today's dashboard fetched successfully",
    "data": {
      "todayStudyEntriesCount": 2,
      "todayRevisionsCount": 1,
      "pendingRevisionsCount": 6,
      "missedRevisionsCount": 2,
      "upcomingRevisionsCount": 5,
      "dailyStudyTimeMinutes": 75,
      "todayStudyEntries": [],
      "todayRevisions": []
    }
  }
  ```

---

## 6. Calendar Endpoints (`/api/v1/calendar`)

### Get Monthly Calendar View
- **Method**: `GET /api/v1/calendar?user_id=1&year=2026&month=8`
- **Response**: `200 OK`
  Returns date-indexed array of days for the target month with aggregated study sessions, study minutes, completed revisions, and missed revisions.

---

---

## 8. Notification Endpoints (`/api/v1/notifications`)

### Get Daily Notifications & Reminders
- **Method**: `GET /api/v1/notifications?user_id=1`
- **Response**: `200 OK`
  Returns unread notification count and items for revisions due today, overdue revisions, and daily study reminders.

---

## 9. Interactive API Documentation (Swagger UI)

### Swagger UI Explorer
- **URL**: `http://localhost:3000/api-docs` or `http://localhost:3000/api/v1/docs`
- **Description**: Interactive OpenAPI browser for testing and inspecting all backend REST endpoints live in the browser.



