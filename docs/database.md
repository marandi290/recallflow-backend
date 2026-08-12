# RecallFlow Database Schema & Specs

## Database: `recallflow`
Dialect: MySQL 8+ / Sequelize ORM

---

## 1. `users` Table
- `id` (BIGINT UNSIGNED, PK, AUTO_INCREMENT)
- `name` (VARCHAR(100), NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NULLABLE for legacy mock users / bcrypt hash)
- `created_at` / `updated_at` (TIMESTAMP)

---

## 2. `courses` Table
- `id` (BIGINT UNSIGNED, PK, AUTO_INCREMENT)
- `user_id` (BIGINT UNSIGNED, FK -> users.id)
- `title` (VARCHAR(100), NOT NULL)
- `category` (VARCHAR(50))
- `goal` (VARCHAR(255))
- `duration_days` (INT)
- `algorithm` (VARCHAR(50), NOT NULL)
- `start_date` (DATE)
- `status` (ENUM('active', 'completed', 'archived'), DEFAULT 'active')
- **Unique Constraint**: `uk_user_course` ON (`user_id`, `title`)

---

## 3. `topics` Table
- `id` (BIGINT UNSIGNED, PK, AUTO_INCREMENT)
- `course_id` (BIGINT UNSIGNED, FK -> courses.id)
- `title` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- **Unique Constraint**: `uk_course_topic` ON (`course_id`, `title`)

---

## 4. `study_entries` Table
- `id` (BIGINT UNSIGNED, PK, AUTO_INCREMENT)
- `topic_id` (BIGINT UNSIGNED, FK -> topics.id)
- `study_date` (DATETIME, NOT NULL)
- `duration_minutes` (INT UNSIGNED, NOT NULL)
- `difficulty` (ENUM('easy', 'medium', 'hard'), NOT NULL)
- `study_notes` (TEXT)
- **Indexes**: `idx_study_date` (`study_date`), `idx_topic_study_date` (`topic_id`, `study_date`)

---

## 5. `revisions` Table
- `id` (BIGINT UNSIGNED, PK, AUTO_INCREMENT)
- `study_entry_id` (BIGINT UNSIGNED, FK -> study_entries.id)
- `revision_number` (INT UNSIGNED, NOT NULL)
- `revision_date` (DATE, NOT NULL)
- `algorithm` (ENUM('quick', 'three_month', 'six_month', 'one_year', 'two_year', 'custom'), NOT NULL)
- `status` (ENUM('pending', 'completed', 'missed'), DEFAULT 'pending')
- `completed_at` (DATETIME)
- `revision_notes` (TEXT)
- **Unique Constraint**: `uk_study_entry_revision` ON (`study_entry_id`, `revision_number`)
- **Indexes**: `idx_revision_date` (`revision_date`), `idx_status` (`status`), `idx_study_entry` (`study_entry_id`)
