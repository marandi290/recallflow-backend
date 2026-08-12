# RecallFlow System Architecture

## Overview
RecallFlow is a backend RESTful service designed for personalized study revision management using Spaced Repetition algorithms.

## Modular Layered Architecture

```
Client Request (HTTP)
        │
        ▼
   Express App (src/app.js)
        │
        ▼
  Joi Validator Middleware (src/middlewares/validate.js)
        │
        ▼
   Controller Layer (src/controllers/*.js)
        │
        ▼
    Service Layer (src/services/*.js) ──► Scheduler Utility (src/utils/scheduler.js)
        │
        ▼
   Sequelize ORM Models (src/models/*.js)
        │
        ▼
   MySQL Database
```

## Entity Relationships

```
User (1) ───< Course (N)
               │
               └───< Topic (N)
                       │
                       └───< StudyEntry (N)
                               │
                               └───< Revision (N)
```

## Spaced Repetition Algorithms

Supported revision intervals (in days from original study date):
- `quick`: [1, 3, 7]
- `three_month`: [3, 7, 15, 30, 60]
- `six_month`: [3, 7, 15, 30, 60, 120, 180]
- `one_year`: [3, 7, 15, 30, 60, 120, 180, 365]
- `two_year`: [3, 7, 15, 30, 60, 120, 180, 365, 730]
- `custom`: [1, 3, 7, 14, 30]

## Error Handling & Response Standard

All endpoints return a uniform response envelope:
```json
{
  "success": true | false,
  "message": "Human readable description",
  "data": { ... } // Present on success
}
```

Errors are captured by `asyncHandler` and processed globally via `ApiError` and `errorHandler` middleware.
